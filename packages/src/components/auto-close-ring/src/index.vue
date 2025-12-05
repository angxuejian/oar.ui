<script lang="ts" setup>
import { computed, ref, onUnmounted, onMounted, watch } from 'vue'
import { type UseCommonProps, useCommonComputed, useNamespace } from '@OarUI/hooks'

interface Props {
  size?: number;
  strokeWidth?: number;
  duration?: number;
  rotate?: number;
  reverse?: boolean;
  closeRatio?: number
}

interface Emits {
  (e: 'close'): void;
}

const props = withDefaults(defineProps<Props & UseCommonProps>(), {
  size: 20,
  strokeWidth: 1,
  duration: 5000,
  rotate: -90,
  reverse: true,
  closeRatio: 0.6
})

const emits = defineEmits<Emits>()
const THEME_DEFAULT = useCommonComputed(props)
const ns = useNamespace('auto-close-ring')
const progress = ref<number>(props.reverse ? 1 : 0)

let start: number | null = null
let animationFrameId: number | null = null

const outerSize = computed(() => props.size)
const viewBox = computed(() => `0 0 ${outerSize.value} ${outerSize.value}`)
const svgStyle = computed(() => ({
  width: `${outerSize.value}px`,
  height: `${outerSize.value}px`,
}))

// 圆环的旋转样式
const ringStyle = computed(() => ({
  transform: `rotate(${props.rotate}deg)`,
  transformOrigin: 'center' // 确保围绕中心旋转
}))

const center = computed(() => outerSize.value / 2) // 中心点
const line = computed(() => props.strokeWidth / 2) // 线宽
const radius = computed(() => center.value - line.value) // 减去一半线宽

// 圆周长
const circumference = computed(() => +(2 * Math.PI * radius.value).toFixed(2))
const dasharray = computed(() => circumference.value)
const dashoffset = computed(() => circumference.value * (1 - progress.value))


// 内圆半径计算 (用于绘制 X)
// 逻辑：(半径 - 线宽) 是内圈边缘，除以 √2 得到内切正方形的半边长；在减去另一半线宽
const innerRadius = computed(() => (radius.value - line.value) / Math.sqrt(2))

// rotate(0deg)时 X 的 45° 交叉对角（斜线）
const crossRatio = Math.max(0, Math.min(props.closeRatio, 1))
const crossOffset = computed(() => innerRadius.value * crossRatio)

// rotate(0deg)计算得的
const x1 = computed(() => center.value - crossOffset.value)
const y1 = computed(() => center.value - crossOffset.value)
const x2 = computed(() => center.value + crossOffset.value)
const y2 = computed(() => center.value + crossOffset.value)

const x3 = computed(() => center.value - crossOffset.value)
const y3 = computed(() => center.value + crossOffset.value)
const x4 = computed(() => center.value + crossOffset.value)
const y4 = computed(() => center.value - crossOffset.value)


const countdownLoop = () => {
  if (start == null) return

  const t = props.duration > 0
    ? Math.min((performance.now() - start) / props.duration, 1)
    : 1

  const p = props.reverse ? 1 - t : t
  progress.value = p

  const shouldContinue = props.reverse ? p > 0 : p < 1

  if (shouldContinue) {
    animationFrameId = requestAnimationFrame(countdownLoop)
    return
  }

  stopCountdown()
  emits('close')
}

const startCountdown = () => {
  start = performance.now()
  progress.value = props.reverse ? 1 : 0
  countdownLoop()
}

const stopCountdown = () => {
  if (animationFrameId != null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  start = null
}

const handleClose = () => {
  stopCountdown()
  emits('close')
}

onMounted(() => {
  startCountdown()
})

watch(() => [props.reverse, props.duration, props.size, props.strokeWidth], () => {
  stopCountdown()
  startCountdown()
})

onUnmounted(() => {
  stopCountdown()
})
</script>


<template>
  <svg role="button" aria-label="Close" @click="handleClose" :class="ns.b()" :viewBox="viewBox" :style="svgStyle"
    xmlns="http://www.w3.org/2000/svg">

    <g :style="ringStyle">
      <circle :class="ns.e('progress-bg')" :stroke-width="props.strokeWidth" :cx="center" :cy="center" :r="radius">
      </circle>

      <circle :stroke-dasharray="dasharray" :stroke-dashoffset="dashoffset" :class="ns.e('progress')"
        :stroke-width="props.strokeWidth" :cx="center" :cy="center" :r="radius"></circle>
    </g>


    <line :class="ns.e('close')" :x1="x1" :y1="y1" :x2="x2" :y2="y2"></line>
    <line :class="ns.e('close')" :x1="x3" :y1="y3" :x2="x4" :y2="y4"></line>
  </svg>
</template>


<style lang="scss" scoped>
@include b('auto-close-ring') {
  display: inline-block;
  pointer-events: auto;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.6;
  }

  &:active {
    opacity: 0.4;
  }

  @include e('progress-bg') {
    stroke: var(--oar-ring-color);
    fill: none;
  }

  @include e('progress') {
    stroke: var(--oar-primary-color);
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
  }

  @include e('close') {
    stroke: var(--oar-primary-color);
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
  }
}
</style>
