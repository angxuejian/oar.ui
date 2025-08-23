<template>
  <div>playground hello world - {{ test }}</div>
  <button @click="add">add</button>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const test = ref<number>(1);

const add = () => {
  test.value++;
};
</script>
