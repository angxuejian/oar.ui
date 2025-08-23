import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import vitePluginVueMarkdown from './plugins/vite-plugin-vue-markdown';

export default defineConfig({
  base: '/',
  plugins: [vue({ include: [/\.vue$/, /\.md$/] }), vitePluginVueMarkdown()],
  server: {
    host: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@VueMarkdown': fileURLToPath(new URL('./plugins/vite-plugin-vue-markdown', import.meta.url)),
    },
  },
});
