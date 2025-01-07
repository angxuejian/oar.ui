<template>

    <!-- <button v-bind="$attrs" v-if="globalConfig.isDefault">
        <slot />
    </button> -->

    <button id="button-container" v-bind="$attrs">
        
        <span><slot /></span>
    </button>

</template>


<script setup lang="ts">
defineOptions({ name: 'OarButton' })
interface Props {
    type: 'primary'
}
const props = withDefaults(defineProps<Props>(), {
    type: 'primary'
})


</script>

<style scoped lang="scss">
#button-container {
    padding: 2px 6px;
    font-size: 12px;
    // border: 1px solid red;
    display: inline-block;
    /* border-radius: 5px; */
    cursor: pointer;

    > span {
        color: red;

        font-size: 20px;
    }
}

</style>