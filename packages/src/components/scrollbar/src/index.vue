
<script lang="ts" setup>
import { ref, type Ref, computed, onMounted } from 'vue'
import { type UseCommonProps, useCommonComputed, useFocusControls, useNamespace } from '@OarUI/hooks'
import { useThumbMouse } from './utils'
import { useResizeObserver } from '@vueuse/core'
import { throttle } from 'throttle-debounce';

const emit = defineEmits(['scroll'])

interface Props {
  always?: boolean,
  scrollY?: boolean,
  scrollX?: boolean
}

const props = withDefaults(defineProps<Props & UseCommonProps>(), {
  always: false,
  scrollY: true,
  scrollX: true
})
const THEME_DEFAULT = useCommonComputed(props);


const ns = useNamespace('scrollbar')
const wrapRef: Ref = ref()
const barHorizontalRef: Ref = ref()
const thumbHorizontalRef: Ref = ref()

const barVerticalRef: Ref = ref()
const thumbVerticalRef: Ref = ref()

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

const wrapClass = computed(() => {
  return [
  ns.e('warp'), 
  ns.is('show', !THEME_DEFAULT.value), 
  ns.is('scroll-y', props.scrollY && !props.scrollX),
  ns.is('scroll-x', !props.scrollY && props.scrollX),
  ns.is('scroll', props.scrollX && props.scrollY)
  ]
})

const { handleMouseDown, getThumbSize, getScrollDistance, calcScrollValue } = useThumbMouse(wrapRef, barHorizontalRef, barVerticalRef)



onMounted(() => {
  calcThumbSize()
  useResizeObserver(wrapRef, throttle(500, () => {
    calcThumbSize()
  }))
})

const calcThumbSize = () => {
  const { height, width } = getThumbSize()
  thumbHeight.value = height
  thumbWidth.value = width
}

const handleScroll = (event: Event) => {
  const { scrollY, scrollX } = getScrollDistance(event.target)
  thumbScrollY.value = scrollY
  thumbScrollX.value = scrollX

  emit('scroll', event)
}

const handleClickBar = (event: MouseEvent) => {
  
  const scrollType = (event.target as HTMLElement).getAttribute('data-type')

  let key = ''
  let value = 0

  if (scrollType === 'Y') {
    const top = thumbHorizontalRef.value.getBoundingClientRect().top

    const startY = top + thumbHorizontalRef.value.offsetHeight / 2
    value = calcScrollValue(event, 'Y', startY, wrapRef.value.scrollTop)
    key = 'scrollTop'

  } else {
    const left = thumbVerticalRef.value.getBoundingClientRect().left

    const startX = left + thumbVerticalRef.value.offsetWidth / 2
    value = calcScrollValue(event, 'X', startX, wrapRef.value.scrollLeft)
    key = 'scrollLeft'
  }
  
  runScrollValue(key, value)
}

const runScrollValue = (key: string, value: number) => {
    let index = 0
    let length = 10
    const speed = Math.ceil((value - wrapRef.value[key]) / length)

    const runTimeout = window.requestAnimationFrame || (fn => setTimeout(fn, 10))
    const main = () => {
      wrapRef.value[key] += speed
      
      if (index < length) runTimeout(main)
        index += 1
    }
    main()
  }

const setScrollTop = (value: number) => {
  runScrollValue('scrollTop', value)
}

const setScrollLeft = (value: number) => {
  runScrollValue('scrollLeft', value)
}

defineExpose({ ref: wrapRef, setScrollTop, setScrollLeft })
</script>


<template>
  <div :class="[ns.b()]">
    <div @scroll="handleScroll" ref="wrapRef" :class="wrapClass">
      <div :class="[ns.e('view')]">
        {{ THEME_DEFAULT }}
          <slot />

      </div>
    </div>

    <div v-show="thumbHeight && !THEME_DEFAULT" @click="handleClickBar" data-type="Y" :class="[ns.e('bar'), ns.e('horizontal')]" ref="barHorizontalRef">
      <div ref="thumbHorizontalRef" @click.stop @mousedown="handleMouseDown" data-type="Y" :style="thumbHorizontalStyle" :class="[ns.e('thumb'), ns.is('always', props.always)]"></div>
    </div>
    <div v-show="thumbWidth && !THEME_DEFAULT" @click="handleClickBar" data-type="X" :class="[ns.e('bar'), ns.e('vertical')]" ref="barVerticalRef">
      <div ref="thumbVerticalRef" @click.stop @mousedown="handleMouseDown" data-type="X" :style="thumbVerticalStyle" :class="[ns.e('thumb'), ns.is('always', props.always)]"></div>
    </div>
 </div>
</template>

<style lang="scss" scoped>

$size: 5px;
.oar-scrollbar {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  &:hover {
    .oar-scrollbar__thumb {
      opacity: 1;
    }
  }

  &__warp {
    height: 100%;
    width: 100%;
    
    &.is-show {
      scrollbar-width: none;
    }
    &.is-scroll {
      overflow: auto;
    }
    &.is-scroll-y {
      overflow-y: auto;
    }
    &.is-scroll-x {
      overflow-x: auto;
    }
  }

  &__view {
    text-wrap: nowrap;
    width: calc(100% - $size);
    height: calc(100% - $size);
  }

  &__bar {
    position: absolute;
    background-color: transparent;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: var(--oar-scrollbar-color);
    }
  }
  &__thumb {
    // border-radius: 5px;
    background-color: var(--oar-scrollthumb-color);
    opacity: 0;
    transition: background-color 0.3s, opacity 0.3s;
    &:hover {
      background-color: var(--oar-scrollthumb-color-hover);
    }
    &.is-always {
      opacity: 1 !important;
    }
  }
  &__horizontal {
    width: $size;
    height: calc(100% - 5px);
    top: 0;
    right: 0;
    .oar-scrollbar__thumb {
      margin: 0 auto;
      width: $size;
      transform: translateY(1px);
    }
  }
  &__vertical{
    height: $size;
    width: calc(100% - 5px);
    bottom: 0;
    left: 0;
    .oar-scrollbar__thumb {
      height: $size;
      transform: translateX(1px);
    }
  }

}
</style>
