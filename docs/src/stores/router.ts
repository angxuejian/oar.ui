import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useRouterStore = defineStore('router', () => {
  const router = ref<any[]>([]);

  return { router };
});
