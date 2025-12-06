<script setup lang="ts">
import { ref } from 'vue'
const expand = ref<boolean>(true)

const onCallback = (d: any) => {
  console.log(d)
}
</script>

<template>
  <div class="play-container" >
    <OarCollapseGroup @change="onCallback" style="width: 200px;" :select="'11'">
      <OarCollapse title="111" name="11">
        <div v-for="value in 10" style="margin-bottom: 20px;">111</div>
      </OarCollapse>
      <OarCollapse title="222" name="22">
        <div v-for="value in 10" style="margin-bottom: 20px;">222</div>
      </OarCollapse>
      <OarCollapse title="333" name="33">
        <div v-for="value in 10" style="margin-bottom: 20px;">333</div>
      </OarCollapse>
    </OarCollapseGroup>

    <OarCollapse @change="onCallback" title="000" style="margin-top: 20px;">
        <div v-for="value in 10" style="margin-bottom: 20px;">000</div>
    </OarCollapse>
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
