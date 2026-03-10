/**
 * @fileoverview Vercel Build Output API v3 builder. Runs the normal esbuild
 * production build, then assembles .vercel/output/ with static files, an
 * Edge Middleware for basic auth, and routing config.
 */

import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import { info, ok } from './log'

// Read .env for auth password (embedded at build time into the edge middleware)
function loadEnv(): Record<string, string> {
  try {
    const content = fs.readFileSync('.env', 'utf-8')
    const env: Record<string, string> = {}
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1)
    }
    return env
  } catch { return {} }
}

const env = loadEnv()
const AUTH_PASSWORD = env.AUTH_PASSWORD || process.env.AUTH_PASSWORD || ''

const OUTPUT = '.vercel/output'
const STATIC = `${OUTPUT}/static`
const MW_DIR = `${OUTPUT}/functions/_middleware.func`

// ── 1. Run normal build ────────────────────────────────────────────────────

info('Running production build...')
execSync('npx tsx tools/dev.ts build', { stdio: 'inherit' })

// ── 2. Create Build Output API v3 structure ────────────────────────────────

fs.rmSync(OUTPUT, { recursive: true, force: true })
fs.mkdirSync(STATIC, { recursive: true })
fs.mkdirSync(MW_DIR, { recursive: true })

// Copy dist/ → .vercel/output/static/
for (const entry of fs.readdirSync('dist', { withFileTypes: true })) {
  fs.cpSync(path.join('dist', entry.name), path.join(STATIC, entry.name), { recursive: true })
}
ok('Static files copied')

// ── 3. Edge Middleware for basic auth ──────────────────────────────────────

fs.writeFileSync(`${MW_DIR}/.vc-config.json`, JSON.stringify({
  runtime: 'edge',
  entrypoint: 'index.js',
  envVarsInUse: ['AUTH_PASSWORD'],
}))

fs.writeFileSync(`${MW_DIR}/index.js`, `
const REALM = 'ABN Coding Assignment';
const USER = 'reviewer';

function unauthorized() {
  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="' + REALM + '"' },
  });
}

export default function middleware(request) {
  const PASS = '${AUTH_PASSWORD}';
  if (!PASS) return;

  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Basic ')) return unauthorized();

  try {
    const decoded = atob(header.slice(6));
    const colon = decoded.indexOf(':');
    if (colon === -1) return unauthorized();
    if (decoded.slice(0, colon) === USER && decoded.slice(colon + 1) === PASS) return;
  } catch (_) {}

  return unauthorized();
}
`)
ok('Edge Middleware created')

// ── 4. Routing config ─────────────────────────────────────────────────────

fs.writeFileSync(`${OUTPUT}/config.json`, JSON.stringify({
  version: 3,
  routes: [
    // Middleware runs on every request
    { src: '/.*', middlewarePath: '_middleware', continue: true },
    // Block search engine indexing
    {
      src: '/.*',
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
      continue: true,
    },
    // SPA fallback: non-asset routes → index.html
    { handle: 'filesystem' },
    { src: '/.*', dest: '/index.html' },
  ],
}, null, 2))
ok('Build Output API v3 config written')
ok('Vercel build complete')
