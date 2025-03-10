import { createRouter, createWebHistory  } from 'vue-router'
import HomeView from '../views/home.vue'

const vueFiles = import.meta.glob("../views/docs/**/*.vue");


const toPascalCase = (str: string): string => {
  return str
    .split(/[-_]/) // 按 `-` 或 `_` 分割
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // 每个单词首字母大写
    .join(""); // 重新拼接
}

const componentRouters = Object.keys(vueFiles).map((path) => {
  const name = path.replace('../views/docs/', '').replace('.vue', '');
  return {
    path: `/${name}`,
    name: `Oar${toPascalCase(name)}`,
    component: vueFiles[path]
  }
});


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,

      children: componentRouters,
    },
  ],
})

export default router
