
<script lang="ts" setup>
import { ref, type Ref, computed, onMounted} from 'vue'
import { useNamespace } from '@OarUI/hooks'
import { useThumbMouse } from './utils'

const ns = useNamespace('scrollbar')
const wrapRef: Ref = ref()
const barRef: Ref = ref()

const thumbHeight = ref<number>(0)
const thumbScrollY = ref<number>(0)

const thumbWidth = ref<number>(0)
const thumbScrollX = ref<number>(0)

const thumbHorizontalStyle = computed(() => {
  return {
    height: thumbHeight.value + '%',
    transform: `translateY(${thumbScrollY.value}%)`
  }
})
const thumbVerticalStyle = computed(() => {
  return {
    width: thumbWidth.value + '%',
    transform: `translateX(${thumbScrollX.value}%)`
  }
})

const { handleMouseDown } = useThumbMouse(wrapRef, barRef)

onMounted(() => {
  const { height, width } = getScrollbarSize()
  thumbHeight.value = height
  thumbWidth.value = width
})

const getScrollbarSize = () => {
  const { clientHeight, scrollHeight, clientWidth, scrollWidth } = wrapRef.value

  // 滚动条高度 = 盒子高度 / 盒子滚动区域高度 * 换算为百分比
  const height = clientHeight / scrollHeight * 100
  const width  = clientWidth  / scrollWidth  * 100

  return { height, width }
}

const getScrollDistance = (event: any) => {
  const { scrollTop, clientHeight, scrollLeft, clientWidth } = event

  // 滚动条滚动高度 = 盒子内容滚动高度 / 盒子滚动区域高度 * 换算为百分比
  const scrollY = scrollTop  / clientHeight * 100
  const scrollX = scrollLeft / clientWidth  * 100

  return { scrollY, scrollX }
}

const handleScroll = (event: any) => {
  const { scrollY, scrollX } = getScrollDistance(event.target)
  thumbScrollY.value = scrollY
  thumbScrollX.value = scrollX
}

// let isMove = false
// let startY = 0
// let startScrollTop = 0
// const handleMouseDown = (event: any) => {
//   isMove = true
//   startY = event.clientY
//   startScrollTop = wrapRef.value.scrollTop
//   document.body.style.userSelect = 'none' // 禁止选中文字
// }

// const handleMouseMove = (event: any) => {
//   if (!isMove) return;
//   const distance = event.clientY - startY
//   const scrollRatio = wrapRef.value.scrollHeight / barRef.value.clientHeight
//   const scrollTop = startScrollTop + distance * scrollRatio
//   wrapRef.value.scrollTop = scrollTop
//   // thumbScrollY.value = scrollTop / wrapRef.value.clientHeight * 100
// }

// const handleMouseUp = () => {
//   isMove = false
//   document.body.style.userSelect = ''
// }

</script>


<template>
  <div :class="[ns.b()]">
    <div @scroll="handleScroll" ref="wrapRef" :class="[ns.e('warp')]">
      <div :class="[ns.e('view')]">
          这是滚动条？这是滚动条？这是滚动条？这是滚动条？这是滚动条？这是滚动条？这是滚动条？这是滚动条？这是滚动条？这是滚动条？这是滚动条？
          <p v-for="(item, index) in 100" :key="index">{{ item }}</p>
      </div>
    </div>

    <div :class="[ns.e('bar'), ns.e('horizontal')]" ref="barRef">
      <div  @mousedown="handleMouseDown" :style="thumbHorizontalStyle" :class="[ns.e('thumb')]"></div>
    </div>
    <div :class="[ns.e('bar'), ns.e('vertical')]">
      <div :style="thumbVerticalStyle" :class="[ns.e('thumb')]"></div>
    </div>
 </div>
</template>

<style lang="scss" scoped>

.oar-scrollbar {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  &__warp {
    height: 100%;
    width: 100%;
    overflow: scroll;
    scrollbar-width: none;
  }

  &__view {
    // text-wrap: nowrap;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    // background-color: blue;
    // padding-right: 8px;
  }

  &__bar {
    position: absolute;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
  &__horizontal {
    width: 6px;
    height: calc(100% - 2px);
    top: 0;
    right: 0;
    .oar-scrollbar__thumb {
      margin: 0 auto;
      width: 3px;
      transform: translateY(1px);
    }
    // background-color: red;
  }
  &__vertical{
    height: 6px;
    width: calc(100% - 2px);
    bottom: 0;
    left: 0;
    .oar-scrollbar__thumb {
      margin: 0 auto;
      height: 3px;
      transform: translateX(1px);
    }
  }
  &__thumb {
      border-radius: 5px;
      background-color: #c1c1c1;
    }
}
</style>
