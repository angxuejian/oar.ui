<template>
  <div>playground hello world - {{ test }}</div>
  <button @click="add">add</button>

  <OarJoystick @change="onCallbackChange"></OarJoystick>
</template>

<script lang="ts" setup>
import OarJoystick from 'packages/components/joystick';
import { ref } from 'vue';

const test = ref<number>(1);

const add = () => {
  test.value++;
};

const onCallbackChange = (e) => {
  console.log(e, ':::触发？')
}
</script>
