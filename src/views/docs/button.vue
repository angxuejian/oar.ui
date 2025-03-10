<script setup lang="ts">
import OarButton from '@OarUI/components/button';
</script>

<template>
  <OarButton default>Default</OarButton>
  <OarButton default loading>Default</OarButton>
  <OarButton default disabled>Default</OarButton>

  <!-- <div>1</div> -->

  <OarButton>Primary</OarButton>
  <OarButton loading>Primary</OarButton>
  <OarButton disabled>Primary</OarButton>
  <!-- <br> -->

  <OarButton plain>Plain primary</OarButton>
  <OarButton plain loading>Plain primary</OarButton>
  <OarButton plain disabled>Plain primary</OarButton>

  <!-- <br> -->
  <OarButton text>Text primary</OarButton>
  <OarButton text loading >Text primary</OarButton>
  <OarButton text disabled >Text primary</OarButton>

</template>
