/// <reference types="vite/client" />

declare module "*.md" {
  const content: string;
  export default content;
}

declare module "vue-router";
declare module "vue";

