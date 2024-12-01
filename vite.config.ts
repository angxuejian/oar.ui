import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue"
import vitePluginVueMarkdown from "./plugins/vite-plugin-vue-markdown";


// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  server: {
    // hmr: true
  },
  plugins: [
    vue({ include: [/\.vue$/, /\.md$/] }),
    vitePluginVueMarkdown(),
  ],

  // assetsInclude: ['**/*.md']
});
