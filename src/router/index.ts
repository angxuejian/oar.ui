import { createWebHistory, createRouter } from "vue-router";

import Test from "../test.vue";

const router = createRouter({
  history: createWebHistory(), // 一定要在 vite.config.ts 中配置 base 路径！
  routes: [
    {
      path: "/",
      component: Test,
    },
    {
      path: "/about",
      component: () => import("../test.md"),
    },
  ],
});

export default router;
