/**
 * @fileoverview Shared esbuild build options used by both dev and production builds.
 */

import * as esbuild from 'esbuild'
import * as path from 'path'
import { vueSfcPlugin } from './vueSfcPlugin'

export function baseOptions(isProd: boolean): esbuild.BuildOptions {
  return {
    entryPoints: ['src/main.ts'],
    bundle: true,
    outdir: 'dist',
    format: 'esm',
    splitting: true,
    sourcemap: isProd ? false : 'inline',
    minify: isProd,
    target: 'es2022',
    define: {
      __VUE_OPTIONS_API__: 'false',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      'process.env.NODE_ENV': isProd ? '"production"' : '"development"',
    },
    plugins: [vueSfcPlugin()],
    loader: {
      '.png': 'file',
      '.jpg': 'file',
      '.svg': 'file',
      '.woff': 'file',
      '.woff2': 'file',
    },
    alias: {
      '@': path.resolve('src'),
    },
    logLevel: 'warning',
  }
}
