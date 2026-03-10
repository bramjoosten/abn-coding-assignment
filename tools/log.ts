/**
 * @fileoverview Color logging utilities for CLI output. Exports prefixed
 * log helpers (info, ok, warn, fail) and ANSI color constants.
 */

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(prefix: string, color: string, msg: string) {
  const time = new Date().toLocaleTimeString('en-GB', { hour12: false })
  console.log(`${c.dim}${time}${c.reset} ${color}${c.bold}[${prefix}]${c.reset} ${msg}`)
}

export const info = (msg: string) => log('task', c.cyan, msg)
export const ok = (msg: string) => log('task', c.green, msg)
export const warn = (msg: string) => log('task', c.yellow, msg)
export const fail = (msg: string) => log('task', c.red, msg)
export { c }
