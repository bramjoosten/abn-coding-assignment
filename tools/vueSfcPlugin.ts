/**
 * @fileoverview esbuild plugin that compiles Vue Single File Components.
 * Handles <script setup>, <template>, and <style scoped> blocks, injecting
 * scoped CSS at runtime via document.head.appendChild.
 */

import * as esbuild from 'esbuild'
import * as fs from 'fs'
import * as path from 'path'
import { compileScript, compileStyle, compileTemplate, parse } from '@vue/compiler-sfc'

export function vueSfcPlugin(): esbuild.Plugin {
  return {
    name: 'vue-sfc',
    setup(build) {
      build.onLoad({ filter: /\.vue$/ }, async (args) => {
        const source = await fs.promises.readFile(args.path, 'utf-8')
        const filename = path.relative(process.cwd(), args.path)
        const id = Buffer.from(filename).toString('hex').slice(0, 8)

        const { descriptor, errors } = parse(source, { filename })
        if (errors.length) {
          return {
            errors: errors.map((e) => ({
              text: e.message,
              location: { file: filename, line: e.loc?.start.line, column: e.loc?.start.column },
            })),
          }
        }

        // Compile <script setup> or <script>
        let scriptCode = ''
        let bindingMetadata: Record<string, any> | undefined
        const hasScript = descriptor.script || descriptor.scriptSetup
        if (hasScript) {
          const compiled = compileScript(descriptor, { id, isProd: build.initialOptions.minify === true })
          scriptCode = compiled.content
          bindingMetadata = compiled.bindings
        }

        // Compile <template>
        let templateCode = ''
        const hasScoped = descriptor.styles.some((s) => s.scoped)
        if (descriptor.template) {
          const tpl = compileTemplate({
            source: descriptor.template.content,
            filename,
            id,
            scoped: hasScoped,
            compilerOptions: { bindingMetadata },
          })
          if (tpl.errors.length) {
            return {
              errors: tpl.errors
                .filter((e): e is SyntaxError => e instanceof SyntaxError)
                .map((e) => ({ text: e.message })),
            }
          }
          templateCode = tpl.code
        }

        // Compile <style scoped>
        let cssCode = ''
        for (const style of descriptor.styles) {
          const result = compileStyle({
            source: style.content,
            filename,
            id: `data-v-${id}`,
            scoped: style.scoped === true,
          })
          if (result.errors.length) {
            return { errors: result.errors.map((e) => ({ text: e.message })) }
          }
          cssCode += result.code + '\n'
        }

        // Assemble output — replace `export default` (with optional PURE comment) with a local binding
        let code: string
        if (!scriptCode) {
          code = 'const _sfc_main: Record<string, any> = {}'
        } else {
          code = scriptCode
            .replace(/export\s+default\s+\/\*.*?\*\/\s*/s, 'const _sfc_main = ')
            .replace(/export\s+default\s+/, 'const _sfc_main = ')
        }

        if (templateCode) {
          code += '\n' + templateCode
          code += '\n_sfc_main.render = render'
        }

        if (hasScoped) {
          code += `\n_sfc_main.__scopeId = "data-v-${id}"`
        }

        if (cssCode.trim()) {
          const escaped = cssCode.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')
          code += `
;(function(){
  const s = document.createElement('style');
  s.textContent = \`${escaped}\`;
  document.head.appendChild(s);
})()`
        }

        code += '\nexport default _sfc_main'

        return { contents: code, loader: 'ts' }
      })
    },
  }
}
