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

const inputRef = ref()

const clickHandler = () => {
  console.log()
  inputRef.value.ref.focus()

  setTimeout(() => {
    inputRef.value.ref.blur()
  }, 5000);
}
const handleKeydown = (e: Event) => {
  console.log(e, '???xx')
}
</script>


<template>
  <input @input="console.log(textValue)" v-model.trim="textValue" readonly type="text">
  <p>
    <OarInput  ref="inputRef" disabled clearable maxlength="20" type="password" @blur="onBlurHandle" @focus="onFocusHandle" @input="console.log(textValue)" v-model.clean="textValue" placeholder="'123'" />
    <OarButton @click="clickHandler">Submit</OarButton>
  </p>

  <p>
    <OarInput @keydown="handleKeydown"  clearable v-model="textValue" placeholder="" />
    <OarButton>Submit</OarButton>
  </p>
</template>
