<script lang="ts" setup>
import OarButton from '@OarUI/components/button'
import { ref } from 'vue'

const isShow = ref(true)
const handlerClick = () => {
  isShow.value = !isShow.value
}
const pos = { x: 0, y: 0 }

setTimeout(() => {
  pos.x = 100
  pos.y = 300
  console.log('已更新')
}, 2000)
</script>

<template>
  <div style="width: 100%; height: 100%; background-color: #ededed">
    <OarWindow width="100px" height="130px" :show="isShow" :defaultPosition="pos"></OarWindow>

    <OarButton @click="handlerClick">按钮</OarButton>
  </div>
</template>

<style lang="scss" scoped></style>
