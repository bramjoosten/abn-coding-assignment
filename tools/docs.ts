/**
 * @fileoverview Documentation checker that enforces @fileoverview JSDoc on
 * TypeScript source files. Vue components are exempt — Storybook autodocs
 * serves as their documentation entrypoint.
 */

import * as fs from 'fs'
import * as path from 'path'
import { info, ok, warn } from './log'

const SRC_DIR = 'src'
const SKIP_DIRS = ['__tests__', 'stories', 'generated', 'assets']
const SKIP_EXTENSIONS = ['.d.ts', '.css', '.stories.ts']

/** Recursively collect .ts source files in src/. */
function collectSourceFiles(dir: string): string[] {
  const files: string[] = []

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (SKIP_DIRS.includes(entry.name)) continue
      files.push(...collectSourceFiles(fullPath))
    } else {
      if (SKIP_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) continue
      // Only check .ts files — Vue components use Storybook for docs
      if (entry.name.endsWith('.ts')) {
        files.push(fullPath)
      }
    }
  }

  return files
}

/** Check if a file contains @fileoverview in the first 20 lines. */
function hasFileOverview(filePath: string): boolean {
  const content = fs.readFileSync(filePath, 'utf-8')
  const head = content.split('\n').slice(0, 20).join('\n')
  return head.includes('@fileoverview')
}

export interface DocCheckResult {
  missing: string[]
  covered: number
  total: number
}

/** Check all .ts source files and return results. */
export function checkDocs(): DocCheckResult {
  const files = collectSourceFiles(SRC_DIR)
  const missing: string[] = []

  for (const file of files) {
    if (!hasFileOverview(file)) {
      missing.push(file)
    }
  }

  return {
    missing,
    covered: files.length - missing.length,
    total: files.length,
  }
}

/** Check a single file for documentation. Returns true if OK. */
export function checkFile(filePath: string): boolean {
  // Only enforce on .ts files
  if (!filePath.endsWith('.ts')) return true
  if (SKIP_EXTENSIONS.some((ext) => filePath.endsWith(ext))) return true

  const relative = path.relative('.', filePath)
  if (SKIP_DIRS.some((d) => relative.includes(`/${d}/`))) return true

  return hasFileOverview(filePath)
}

/** Run full doc check and print results. */
export function runDocCheck() {
  info('Checking documentation...')
  const { missing, covered, total } = checkDocs()

  if (missing.length === 0) {
    ok(`All files documented (${covered}/${total})`)
  } else {
    warn(`${missing.length} file(s) missing @fileoverview:`)
    for (const file of missing) {
      console.log(`  ${file}`)
    }
  }

  return missing.length === 0
}
