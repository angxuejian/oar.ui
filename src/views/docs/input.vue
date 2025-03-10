<script setup lang="ts">
import OarInput from '@OarUI/components/input';
import OarButton from '@OarUI/components/button';
import { ref } from 'vue';

const textValue = ref<string>('');

// console.log(textValue.value);
</script>


<template>
  <!-- <input @input="console.log(textValue)" v-model.trim="textValue" type="text"> -->
  <p>
    <OarInput @input="console.log(textValue)" v-model.lowercase="textValue" placeholder="'123'" />
    <OarButton>Submit</OarButton>
  </p>

  <p>
    <OarInput v-model="textValue" placeholder="'123'" />
    <OarButton>Submit</OarButton>
  </p>
</template>
