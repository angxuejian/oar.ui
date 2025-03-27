import { Plugin } from 'vite'
import markdownit from 'markdown-it'
import { HmrContext } from 'vite'
import container from 'markdown-it-container'
import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc'

let index = -1
const demoComponentArray: any = []
const startTitle = '<remove-code-start>'
const endTitle = '<remove-code-end>'

const createComponent = (code: string) => {
  const sfc = parse(code) // 解析 SFC 代码

  if (sfc.descriptor.template) {
    index += 1
    
    const id = `demo-${index}`
    const filename = id + '.vue'

    const template = compileTemplate({
      id,
      source: sfc.descriptor.template?.content || '',
      filename: filename,
    })
    const renderFnCode = template.code
      .replace(/import {.*} from "vue"/, '')
      .replace('export ', '')
      .trim()


    let scriptFnCode
    if (sfc.descriptor.scriptSetup || sfc.descriptor.script) {
      const script = compileScript(sfc.descriptor, { id, inlineTemplate: true })
      scriptFnCode = script.content
        .replace(/import {.*} from ["']vue["'];?/g, '') // 移除 import 语句
        .replace('export default', '') // 移除 export 语句
        .replace('/*@__PURE__*/_defineComponent(', '')
        .trim()

      if (scriptFnCode[scriptFnCode.length - 1] === ')') {
        scriptFnCode = scriptFnCode.slice(0, scriptFnCode.length - 1)
      }
      if (scriptFnCode[0] === '{' && scriptFnCode[scriptFnCode.length - 1] === '}') {
        scriptFnCode = scriptFnCode.slice(1, -1)
      }
    }

    // let styleFnCode
    // if (sfc.descriptor.styles.length) {
    //   const styles = compileStyle({ source: sfc.descriptor.styles[0].content, id, filename, scoped: true })
    //   styleFnCode = 'css:' + styles.code
    //   console.log(styleFnCode)
    // }

    demoComponentArray.push(`
      const component${index} = defineComponent({
        render: ${renderFnCode},
        ${scriptFnCode},
      })
    `)
    return index
  } else {
    return code
  }
}

const createMarkdownit = () => {
  const md = markdownit({ html: true })

  md.use(container, 'details', {
    render(tokens: any[], idx: number) {
      const token = tokens[idx]

      if (token.nesting === 1) {
        const title = token.info.trim().slice(8).trim() || 'details'
        return `<details class="details">\n<summary>${title}</summary>\n`
      } else {
        return `</details>\n`
      }
    },
  })

  md.use(container, 'demo', {
    render(tokens: any[], idx: number) {
      const token = tokens[idx]

      if (token.nesting === 1) {
        let codeContent = ''
        let nextIdx = idx + 1

        while (nextIdx < tokens.length && tokens[nextIdx].nesting !== -1) {
          codeContent += tokens[nextIdx].content + '\n'
          nextIdx++
        }
        codeContent = codeContent.slice(0, -1)

        let templateCodeContent = codeContent
        if (!codeContent.includes('<template>')) {
          templateCodeContent = `<template>${codeContent}</template>`
        }
        const result = createComponent(templateCodeContent)
        let str = ''
        if (typeof result === 'number') {
          str = `<component :is='component${result}'></component>`
        } else {
          str = result
        }
        return `<DemoBlock code="${codeContent}">${str}${startTitle}`
      } else {
        return `${endTitle}</DemoBlock>\n`
      }
    },
  })

  return md
}

const vitePluginVueMarkdown = (): Plugin => {
  return {
    name: 'vite-plugin-vue-markdown',
    enforce: 'pre',

    transform(code, id) {
      if (id.endsWith('.md')) {
        const md = createMarkdownit()
        const result = md.render(code).replace(new RegExp(`${startTitle}.*?${endTitle}`, 'gs'), '')
        return {
          code: `
            <template>
              <div class='markdown-body'>
                ${result}
              </div>
            
            </template>
            <script setup lang='ts'>
              import { ref, defineComponent  } from 'vue';
              import { resolveComponent as _resolveComponent, Fragment as _Fragment } from 'vue';
              import DemoBlock from '@VueMarkdown/demo-block/index.vue';
              ${demoComponentArray.join('\n')}

            </script>

            <style scoped>
              summary {
                user-select: none;
              }
            </style>
          `,
          map: null,
        }
      }
    },
    handleHotUpdate(ctx: HmrContext) {
      const { file, server } = ctx
      if (file.endsWith('.md')) {
        const mod = server.moduleGraph.getModuleById(file)
        if (mod) {
          server.reloadModule(mod)
          return [mod]
        }
      }
    },
  }
}

export default vitePluginVueMarkdown
