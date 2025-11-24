import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home.vue'
import { useRouterStore } from '@/stores/router'

const vueFiles = import.meta.glob('../views/docs/**/*.md')
const routerArray: any[] = []

const toPascalCase = (str: string): string => {
  return str
    .split(/[-_]/) // 按 `-` 或 `_` 分割
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // 每个单词首字母大写
    .join('') // 重新拼接
}

const componentRouters = Object.keys(vueFiles).map((path) => {
  const name = path.replace('../views/docs/', '').replace('.md', '')
  const p = '/' + name
  routerArray.push({ path: p, name })
  return {
    path: p,
    name: `Oar${toPascalCase(name)}`,
    component: vueFiles[path],
  }
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,

      children: componentRouters,
    },
    {
      path: '/play',
      name: 'play',
      component: () => import('../views/play.vue'),
    },
  ],
})

let isStoreInitialized = false
router.beforeEach(() => {
  if (!isStoreInitialized) {
    const routerStore = useRouterStore()
    routerStore.router.push(...routerArray)
    isStoreInitialized = true
  }
})

export default router
