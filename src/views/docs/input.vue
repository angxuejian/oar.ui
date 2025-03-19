<script setup lang="ts">
import OarInput from '@OarUI/components/input';
import OarButton from '@OarUI/components/button';
import { ref } from 'vue';

const textValue = ref<string>('');

// console.log(textValue.value);

const onFocusHandle = (e: FocusEvent) => {
  console.log(e, 'use chuf ')
}
const onBlurHandle = (e: FocusEvent) => {
  console.log(e, 'xx')
}
</script>


<template>
  <!-- <input @input="console.log(textValue)" v-model.trim="textValue" type="text"> -->
  <p>
    <OarInput @blur="onBlurHandle" @focus="onFocusHandle" clearable @input="console.log(textValue)" v-model.lowercase="textValue" placeholder="'123'" />
    <OarButton>Submit</OarButton>
  </p>

  <p>
    <OarInput v-model="textValue" placeholder="" />
    <OarButton>Submit</OarButton>
  </p>
</template>
