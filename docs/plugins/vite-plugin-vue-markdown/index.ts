import { Plugin } from 'vite';
import markdownit from 'markdown-it';
import { HmrContext } from 'vite';
import container from 'markdown-it-container';
import { parse } from '@vue/compiler-sfc';

let index = -1;
const importValueArray: string[] = [];
const startTitle = '<remove-code-start>';
const endTitle = '<remove-code-end>';
const virtualModuleId = 'virtual:component-demo/';
const componentDemoStore: Record<string, string> = {}; // 保存 id -> vue代码
const filename = '.vue';

const generateVueDemoComponent = (code: string) => {
  const sfc = parse(code); // 解析 SFC 代码

  index += 1;

  const id = `Oar${index}`;
  const compomentName = `VirtualComponentDemo` + id;
  const componentPath = virtualModuleId + id + filename;
  importValueArray.push(`import ${compomentName} from '${componentPath}'`);
  componentDemoStore[id] = sfc.descriptor.source;
  return {
    source: sfc.descriptor.source,
    compomentName,
  };
};

const createMarkdownit = () => {
  const md = markdownit({ html: true });

  md.use(container, 'details', {
    render(tokens: any[], idx: number) {
      const token = tokens[idx];

      if (token.nesting === 1) {
        const title = token.info.trim().slice(8).trim() || 'details';
        return `<details class="details">\n<summary>${title}</summary>\n`;
      } else {
        return `</details>\n`;
      }
    },
  });

  md.use(container, 'demo', {
    render(tokens: any[], idx: number) {
      const token = tokens[idx];

      if (token.nesting === 1) {
        let codeContent = '';
        let nextIdx = idx + 1;

        while (nextIdx < tokens.length && tokens[nextIdx].nesting !== -1) {
          codeContent += tokens[nextIdx].content + '\n';
          nextIdx++;
        }
        codeContent = codeContent.slice(0, -1);

        let templateCodeContent = codeContent;
        if (!codeContent.includes('<template>')) {
          templateCodeContent = `<template>${codeContent}</template>`;
        }

        const { source, compomentName } = generateVueDemoComponent(templateCodeContent);
        const demoComponentStr = `<${compomentName} />`;

        return `<DemoBlock code="${source}">${demoComponentStr}${startTitle}`;
      } else {
        return `${endTitle}</DemoBlock>\n`;
      }
    },
  });

  return md;
};

const generateVueContainer = (code: string) => {
  const md = createMarkdownit();
  const result = md.render(code).replace(new RegExp(`${startTitle}.*?${endTitle}`, 'gs'), '');
  const importStr = [...new Set(importValueArray)].join('\n');
  return {
    code: `
       <template>
        <div class='markdown-body'>
          ${result}
        </div>

      </template>
      <script setup lang='ts'>
        import DemoBlock from '@VueMarkdown/demo-block/index.vue';
        ${importStr}

      </script>

      <style scoped>
        summary {
          user-select: none;
        }
      </style>
    `,
    map: null,
  };
};

const vitePluginVueMarkdown = (): Plugin => {
  /**
   * 虚拟模块说明： https://cn.vite.dev/guide/api-plugin.html#virtual-modules-convention
   *
   * 1. transform钩子：识别到md文件转换为vue sfc 内容
   * 2. 重新执行插件，去识别转换后的vue sfc内容（包含：virtual:component-demo/）
   *
   * 3. resolveId钩子：识别到 virtual:component-demo/ 组件
   * 4. load钩子：识别到 virtual:component-demo/ 组件，提取key值，读取 componentDemoStore 存在的源码
   * 5. transform钩子：再次进入，识别为vue语法，放行通过，交给 @vitejs/plugin-vue 插件去渲染
   */
  return {
    name: 'vite-plugin-vue-markdown',
    enforce: 'pre',

    resolveId(id) {
      if (id.startsWith(virtualModuleId)) {
        return id;
      }
    },

    load(id) {
      if (id.startsWith(virtualModuleId) && id.endsWith(filename)) {
        const key = id.slice(virtualModuleId.length, id.length - filename.length);
        return componentDemoStore[key];
      }
    },

    transform(code, id) {
      if (id.endsWith('.md')) {
        const { code: newCode, map } = generateVueContainer(code);
        return {
          code: newCode,
          map: map,
        };
      }
    },

    handleHotUpdate(ctx: HmrContext) {
      const { file, server } = ctx;
      if (file.endsWith('.md')) {
        const mod = server.moduleGraph.getModuleById(file);
        if (mod) {
          server.reloadModule(mod);
          return [mod];
        }
      }
    },
  };
};

export default vitePluginVueMarkdown;
