<template>
    <Transition @before-leave="closeMsg" @after-leave="destoryMsg">
        <div ref="messageRef" v-show="visible" :style="messageStyle" class="oar-message">
            
            oar message
        </div>
    </Transition>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
defineOptions({
    name: 'OarMessage'
})

defineProps({
    message: String,
    closeMsg: Function,
    destoryMsg: Function
})

const visible = ref(false)
const offsetTop = ref(0)
const messageRef = ref(null)

const messageStyle = computed(() => {
    return `top: ${offsetTop.value}px;`
})

onMounted(() => {
    visible.value = true
    setTimeout(() => {
        close()
    }, 3000)
})

const setOffsetTopValue = (value) => {
    offsetTop.value = value
}

const close = () => {
    visible.value = false
}

defineExpose({ setOffsetTopValue, close })
</script>