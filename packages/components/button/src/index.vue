<script lang="ts" setup>
import { globalConfig } from '@OarUI/hook/useGlobalConfig';

</script>


<template>

  <button class="button">123  oar button {{ globalConfig.isDefault }}</button>
</template>


<style scoped lang="scss">
// @use '@OarUI/theme/base.scss' as base;


// .button {
//   background-color: base.$parimary-color;
//   color: white;
// }

// .button:hover {
//   background-color: base.$parimary-color-hover;
// }

// .button:active {
//   background-color:base.$parimary-color-active;
// }

// .button:disabled {
//   background-color: base.$parimary-color-disabled;
//   color: rgba(255, 255, 255, 0.5);
// }

</style>
