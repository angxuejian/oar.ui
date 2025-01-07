import { createWebHistory, createRouter } from "vue-router";

import AppExample from "../views/example/index.vue";

const router = createRouter({
  history: createWebHistory(), // 一定要在 vite.config.ts 中配置 base 路径！
  routes: [
    {
      path: "/",
      component: AppExample,
      children: [
        {
          path: "/button",
          component: () => import("../views/example/button.vue"),
        },
      ]
    },

    {
      path: "/about",
      component: () => import("../views/test.md"),
    },
  ],
});

export default router;
