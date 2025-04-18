<template>

    <div>
        <slot />
    </div>
</template>


<script setup lang="ts">
interface Props {
    code: string
}
const props = defineProps<Props>();

// console.log(props.code)

</script>