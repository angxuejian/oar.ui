import { Plugin } from "vite";
import markdownit from "markdown-it";
import { HmrContext } from "vite";
//  ModuleNode, HMRPayload
const vitePluginVueMarkdown = (): Plugin => {
  return {
    name: "vite-plugin-vue-markdown",
    enforce: "pre",

    buildStart() {
      console.log("Build started");
    },

    transform(code, id) {
      if (id.endsWith(".md")) {
        const md = markdownit();
        return {
          code: `
            <template>
              ${md.render(code)}
            </template>
            <script setup>
              import { ref } from 'vue';
            </script>
          `,
          map: null,
        };
      }
    },

    handleHotUpdate(ctx: HmrContext) {
      const { file, server } = ctx;
      // modules, timestamp
      if (file.endsWith(".md")) {
        // 全更新
        // const invalidatedModules: Set<ModuleNode> = new Set();
        // for (const mod of modules) {
        //   server.moduleGraph.invalidateModule(
        //     mod,
        //     invalidatedModules,
        //     timestamp,
        //     true
        //   );
        // }
        // const payload: HMRPayload = { type: 'full-reload'}
        // server.ws.send(payload);
        // return []

        // 局部更新
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
