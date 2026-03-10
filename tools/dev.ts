import * as esbuild from 'esbuild'
import * as fs from 'fs'
import * as http from 'http'
import { execSync, spawn } from 'child_process'
import { info, ok, fail, warn, c } from './log'
import { generateHtml } from './html'
import { baseOptions } from './esbuild'
import { runDocCheck, checkFile } from './docs'

// ── Tasks ───────────────────────────────────────────────────────────────────

async function dev() {
  info('Starting dev server...')

  const ctx = await esbuild.context(baseOptions(false))

  const { host, port } = await ctx.serve({ servedir: 'dist', port: 3001 })

  // Proxy server that serves index.html for SPA routes
  const proxy = http.createServer(async (req, res) => {
    const url = req.url || '/'

    const isAsset = url.includes('.') && !url.endsWith('.html')
    const proxyPath = isAsset ? url : '/index.html'

    const proxyReq = http.request(
      { hostname: host, port, path: proxyPath, method: req.method, headers: req.headers },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers)
        proxyRes.pipe(res, { end: true })
      }
    )
    proxyReq.on('error', () => {
      res.writeHead(502)
      res.end('esbuild serve not ready')
    })
    req.pipe(proxyReq, { end: true })
  })

  // Write index.html for dev
  fs.mkdirSync('dist', { recursive: true })
  fs.writeFileSync('dist/index.html', generateHtml('main.js', 'main.css'))

  proxy.listen(5173, () => {
    ok(`Dev server running at ${c.bold}http://localhost:5173${c.reset}`)
    info('Watching for changes...')
  })

  await ctx.watch()

  // Watch for doc coverage on source file changes
  fs.watch('src', { recursive: true }, (_, filename) => {
    if (!filename || (!filename.endsWith('.ts') && !filename.endsWith('.vue'))) return
    const filePath = `src/${filename}`
    if (!fs.existsSync(filePath)) return
    if (!checkFile(filePath)) {
      warn(`Missing @fileoverview: ${filePath}`)
    }
  })

  runDocCheck()
}

async function build() {
  info('Building for production...')

  // Clean
  fs.rmSync('dist', { recursive: true, force: true })

  const result = await esbuild.build({
    ...baseOptions(true),
    metafile: true,
    entryNames: '[name]-[hash]',
    chunkNames: 'chunks/[name]-[hash]',
    assetNames: 'assets/[name]-[hash]',
  })

  // Find output files for HTML
  const outputs = Object.keys(result.metafile!.outputs)
  const jsEntry = outputs.find((f) => f.match(/main-.*\.js$/))?.replace('dist/', '')
  const cssEntry = outputs.find((f) => f.endsWith('.css'))?.replace('dist/', '')

  if (jsEntry) {
    fs.writeFileSync('dist/index.html', generateHtml(jsEntry, cssEntry))
  }

  // Size report
  const analysis = await esbuild.analyzeMetafile(result.metafile!)
  ok('Build complete:')
  console.log(analysis)
}

async function test() {
  info('Running tests...')
  const child = spawn('pnpm', ['exec', 'vitest', 'run', '--reporter=verbose'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'test' },
  })
  return new Promise<void>((resolve, reject) => {
    child.on('close', (code) => {
      if (code === 0) {
        ok('All tests passed')
        resolve()
      } else {
        fail(`Tests failed with exit code ${code}`)
        reject(new Error(`exit ${code}`))
      }
    })
  })
}

function typecheck() {
  info('Type checking...')
  try {
    execSync('pnpm exec vue-tsc --noEmit', { stdio: 'inherit' })
    ok('No type errors')
  } catch {
    fail('Type errors found')
    process.exit(1)
  }
}

function storybook() {
  info('Starting Storybook...')
  const child = spawn('pnpm', ['exec', 'storybook', 'dev', '-p', '6006'], {
    stdio: 'inherit',
  })
  child.on('close', (code) => {
    if (code !== 0) fail(`Storybook exited with code ${code}`)
  })
}

function docs() {
  const pass = runDocCheck()
  if (!pass) process.exit(1)
}

async function ci() {
  info('Running CI pipeline...')
  docs()
  typecheck()
  await test()
  await build()
  ok('CI pipeline complete')
}

// ── CLI ─────────────────────────────────────────────────────────────────────

const tasks: Record<string, () => Promise<void> | void> = { dev, build, test, typecheck, docs, ci, storybook }

const task = process.argv[2]
if (!task || !tasks[task]) {
  console.log(`\nUsage: tsx tools/dev.ts <task>\n\nTasks: ${Object.keys(tasks).join(', ')}\n`)
  process.exit(1)
}

info(`Running task: ${c.bold}${task}`)
Promise.resolve(tasks[task]()).catch((err) => {
  fail(err.message || err)
  process.exit(1)
})
