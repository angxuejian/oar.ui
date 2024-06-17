

<template>
  <div>home

    <button @click="add">add</button>
    <!-- <OarMessage /> -->
  </div>
</template>

<script setup>
import OarMessage from '@/oar.ui/components/message'

const add = () => {
  OarMessage()
}
</script>