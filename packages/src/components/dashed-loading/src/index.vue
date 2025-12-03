<script lang="ts" setup>
import { computed } from 'vue'
import { type UseCommonProps, useNamespace } from '@OarUI/hooks'

interface Props {
  radius?: number;
  strokeWidth?: number;
  padding?: number;
  dashLong?: number
}

const props = withDefaults(defineProps<Props & UseCommonProps>(), {
  radius: 10,
  strokeWidth: 1,
  padding: 4,
  dashLong: 0.75
})

const ns = useNamespace('dashed-loading')

const percent = computed(() => Math.max(0, Math.min(props.dashLong, 1)))

// svg + circle size
const outer = computed(() => props.radius + props.strokeWidth + props.padding)
const viewBoxSize = computed(() => Math.ceil(outer.value * 2))
const viewBox = computed(() => `0 0 ${viewBoxSize.value} ${viewBoxSize.value}`)
const center = computed(() => outer.value)

// 圆周长
const circumference = computed(() => +(2 * Math.PI * props.radius).toFixed(2))
const dashLong = computed(() => +(circumference.value * percent.value).toFixed(2))
const dashGap = computed(() => +(circumference.value - dashLong.value).toFixed(2))


const svgStyle = computed(() => ({
  width: `${viewBoxSize.value}px`,
  height: `${viewBoxSize.value}px`,
  '--circ': `${circumference.value}px`,
  '--dash-long': `${dashLong.value}px`,
  '--dash-gap': `${dashGap.value}px`
}))
</script>


<template>

  <svg :class="ns.b()" :viewBox="viewBox" :style="svgStyle" xmlns="http://www.w3.org/2000/svg">
    <circle :class="ns.e('circle')" :cx="center" :stroke-width="props.strokeWidth" :cy="center" :r="props.radius">
    </circle>
  </svg>
</template>



<style lang="scss" scoped>
@include b('dashed-loading') {
  display: inline-block;
  animation: rotate 2s linear infinite;

  @include e('circle') {
    stroke: var(--oar-primary-color);
    fill: none;
    stroke-linecap: round;
    stroke-dasharray: var(--dash-long) var(--circ);
    stroke-dashoffset: 0;
    animation: breathing 1.5s ease-in-out infinite, flowing 1.5s linear infinite;;
    transform-origin: center;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes flowing {
  100% {
    stroke-dashoffset: calc(-1 * var(--circ));
  }
}

@keyframes breathing  {
  0% {
    stroke-dasharray: 1, var(--circ);
  }
  50% {
    stroke-dasharray: var(--dash-long), var(--circ);
  }
  100% {
    stroke-dasharray: var(--dash-long), var(--circ);
  }
}
</style>
