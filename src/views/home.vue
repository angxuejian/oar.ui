<template>


  <main class="main-container">

    <ul class="menu">
        <li v-for="(item, index) in store.router" :key="index"> <RouterLink :to="item.path">{{ item.name }}</RouterLink> </li>
    </ul>

    <div class="body">
      <RouterView />
    </div>
  </main>
</template>


<script setup lang="ts">
import { useRouterStore } from '@/stores/router';

const store = useRouterStore()

</script>


<style lang="scss" scoped>
.main-container {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}

ul {
  outline: none;
  padding: 0;
  margin: 0;
  width: 15%;
  background-color: #f5f5f5;
  margin-right: 10px;
}
.body {
  flex: 1;
  overflow-y: auto;
  padding-top: 10px;
  padding-bottom: 50px;
}

</style>
