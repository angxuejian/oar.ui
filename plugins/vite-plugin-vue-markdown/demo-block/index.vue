<template>

    <div>
        <slot />
    </div>
</template>


<script setup lang="ts">
import {  defineProps } from "vue";
interface Props {
    code: string
}
defineProps<Props>();

// console.log(props.code)

</script>