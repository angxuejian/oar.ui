import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginVueMarkdown from './plugins/vite-plugin-vue-markdown'
// import vueJsx from '@vitejs/plugin-vue-jsx'
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({include: [/\.vue$/, /\.md$/] }),
    vitePluginVueMarkdown(),

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
      "@VueMarkdown": fileURLToPath(new URL('./plugins/vite-plugin-vue-markdown', import.meta.url)),
    },
  },
})
