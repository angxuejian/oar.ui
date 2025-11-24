
<script lang="ts" setup>
import OarButton from '@OarUI/components/button';
import { ref } from 'vue';

const isShow = ref(false);
const handlerClick = () => {
  isShow.value = !isShow.value;
}
</script>

<template>

  <div style="width: 100%; height: 100%; background-color: #ededed;">
    <OarWindow width="100px" height="130px" v-model:show="isShow" :defaultPosition="{ x: 100, y: 100 }"></OarWindow>

    <OarButton @click="handlerClick">按钮</OarButton>
  </div>

</template>




<style lang="scss" scoped>

</style>

