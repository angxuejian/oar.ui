import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginVueMarkdownRuntime from './plugins/vite-plugin-vue-markdown-runtime'

// import vueJsx from '@vitejs/plugin-vue-jsx'
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vitePluginVueMarkdownRuntime(),
    vue({include: [/\.vue$/, /\.md$/] }),
    // vueJsx(),
    // vueDevTools(),
  ],
  server: {
    host: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@OarUI': fileURLToPath(new URL('./packages/src', import.meta.url)),
      "@VueMarkdown-runtime": fileURLToPath(new URL('./plugins/vite-plugin-vue-markdown-runtime', import.meta.url)),
    },
  },
})
