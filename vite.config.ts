import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginVueMarkdown from './plugins/vite-plugin-vue-markdown'

// import { visualizer } from 'rollup-plugin-visualizer'
// import vueJsx from '@vitejs/plugin-vue-jsx'
// import vueDevTools from 'vite-plugin-vue-devtools'

const normalizePath = (p: string) => p.replace(/\\/g, '/');
const themeBase =  normalizePath(fileURLToPath(new URL('./packages/theme/base.scss', import.meta.url)));


// https://vite.dev/config/
export default defineConfig({
  base: '/oar.ui/',
  plugins: [
    vue({include: [/\.vue$/, /\.md$/] }),
    vitePluginVueMarkdown(),

    // visualizer({
    //   filename: 'dist/stats.html', // 输出分析文件路径
    //   open: true,                  // 构建后自动打开浏览器查看
    //   gzipSize: true,              // 显示 gzip 压缩体积
    //   brotliSize: true,            // 显示 brotli 压缩体积
    //   template: 'treemap',         // 可选: sunburst / treemap / network
    // }),
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
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "${themeBase}" as *;`,
        api: 'modern-compiler',
      }
    }
  },

  // 预构建，用于 Vite dev server 启动更快、HMR 更快。
  optimizeDeps: {
    include: ['vue', 'vue-router', '@vueuse/core']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',

    rollupOptions: {
      // external: ['vue'], // 打包组件库时，将vue剔除
      treeshake: true,
      output: {
        entryFileNames: 'assets/[name].[hash].js', // 入口文件（main.ts / index.ts）产物的命名规则
        chunkFileNames: 'assets/js/[name].[hash].js', // 非入口的代码分块（动态导入的 chunk）产物的命名规则
        assetFileNames: 'assets/[ext]/[name].[hash].[ext]', // 静态资源（图片、字体、css 等）产物的命名规则
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes('@vueuse')) return 'vueuse';
            if (id.includes('throttle-debounce')) return 'throttle-debounce';
            if (id.includes('lucide-vue-next')) return 'vicons';
            return 'vendor'
          }
        }
      }
    }
  }
})
