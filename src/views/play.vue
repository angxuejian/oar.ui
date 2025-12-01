<script setup lang="ts">
import { ref } from 'vue'

const maskVisible = ref(true)
setTimeout(() => {
  maskVisible.value = false
}, 5000)

const toggleMask = () => {
  maskVisible.value = !maskVisible.value
}
</script>

<template>
  <div class="play-container">
    <OarButton @click="toggleMask">Toggle Mask</OarButton>
    <OarMask v-model:show="maskVisible">
      <div class="mask-content">
        <h3>Mask Content</h3>
        <p>Click mask to close</p>
      </div>
    </OarMask>
  </div>
</template>

<style scoped>
.play-container {
  padding: 20px;
}
.mask-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
}
</style>
