import { Plugin } from 'vite'
import markdownit from 'markdown-it'
import { HmrContext } from 'vite'
import container from 'markdown-it-container'
import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc'

let index = -1
const importValueArray: string[] = []
const demoComponentArray: any = []
const startTitle = '<remove-code-start>'
const endTitle = '<remove-code-end>'

const generateVueDemoComponent = (code: string) => {
  const sfc = parse(code) // 解析 SFC 代码

  index += 1

  const id = `demo-compoment-${index}`
  const filename = id + '.vue'
  const reg = /import {(.*)} from ['"]vue['"]/ // 获取需要导入的方法
  let vueImportValue: RegExpMatchArray | null = null

  const getVueImportValue = (content: string) => {
    return content.match(new RegExp(reg, 'g'))
  }

  const template = compileTemplate({
    id,
    source: sfc.descriptor.template?.content || '',
    filename: filename,
  })

  let script: any | null = null
  let scriptFnCode
  if (sfc.descriptor.scriptSetup || sfc.descriptor.script) {
    script = compileScript(sfc.descriptor, { id, inlineTemplate: true })
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

  let render: string = ''
  const renderFnCode1 = template.code
    .replace(/import {.*} from ["']vue["']/, '')
    .replace('export ', '')
    .trim()

  if (!scriptFnCode && !script) {
    vueImportValue = getVueImportValue(template.code)
    const splitCode = renderFnCode1.split('function render')
    const variable = splitCode[0]
    const renderFn = 'function render' + splitCode[1]
    const args = template.code.match(/function render\((.*?)\) {/)
    const argsStr = args ? args[1] : ''

    render = `render: function renderFn(${argsStr}) {
      ${variable}
      return ${renderFn}(${argsStr})
    }`
  } else {
    vueImportValue = getVueImportValue(script.content)

    render = scriptFnCode
  }

  // 可增加样式
  // let styleFnCode
  // if (sfc.descriptor.styles.length) {
  //   const styles = compileStyle({ source: sfc.descriptor.styles[0].content, id, filename, scoped: true })
  //   styleFnCode = 'css:' + styles.code
  //   console.log(styleFnCode)
  // }

  if (vueImportValue) {
    vueImportValue.forEach((item) => {
      const importComponent = item.match(reg)
      if (importComponent) {
        const importComponentStr = importComponent[1].split(',').map((item) => item.trim())
        importValueArray.push(...importComponentStr)
      }
    })
  }

  demoComponentArray.push(`
    const component${index} = _defineComponent({
      name: '${id}',
      ${render}
    })
  `)
  return index
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

        const index = generateVueDemoComponent(templateCodeContent)
        const demoComponentStr = `<component :is='component${index}'></component>`

        return `<DemoBlock code="${codeContent}">${demoComponentStr}${startTitle}`
      } else {
        return `${endTitle}</DemoBlock>\n`
      }
    },
  })

  return md
}

const generateVueContainer = (code: string) => {
  const md = createMarkdownit()
  const result = md.render(code).replace(new RegExp(`${startTitle}.*?${endTitle}`, 'gs'), '')
  const importStr = [...new Set(importValueArray)].join(',')
  const componentStr = demoComponentArray.join('\n')

  return {
    code: `
     <template>
        <div class='markdown-body'>
          ${result}
        </div>

      </template>
      <script setup lang='ts'>
        import { ${importStr} } from 'vue';
        import DemoBlock from '@VueMarkdown-runtime/demo-block/index.vue';
        ${componentStr}

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

const vitePluginVueMarkdown = (): Plugin => {
  return {
    name: 'vite-plugin-vue-markdown',
    enforce: 'pre',

    transform(code, id) {
      if (id.endsWith('.md')) {
        const { code: newCode, map } = generateVueContainer(code)
        return {
          code: newCode,
          map: map,
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
