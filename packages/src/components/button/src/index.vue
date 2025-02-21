<script lang="ts" setup>
import { computed } from 'vue';
import { type UseCommonProps, useCommonComputed } from '@OarUI/use/usePropsComputed';

interface Props {
  type?: 'primary';
  loading?: boolean;
  disabled?: boolean;
  plain?: boolean;
  text?: boolean;
}
const props = withDefaults(defineProps<Props & UseCommonProps>(), {
  type: 'primary',
  loading: false,
  disabled: false,
  plain: false,
  text: false
});
const THEME_DEFAULT = useCommonComputed(props);


const buttonClass = computed(() => {
  return {
    [`oar-button--${props.type}`]: !THEME_DEFAULT.value,
    'oar-button--loading': props.loading && !props.disabled,
    'is-default': THEME_DEFAULT.value,
    [`is-plain`]: !THEME_DEFAULT.value && props.plain,
    [`is-text`]: !THEME_DEFAULT.value && !props.plain && props.text
  }
});

</script>

<template>
  <button v-on="$attrs" class="oar-button" :class="buttonClass" :disabled="disabled">
    <svg v-if="props.loading && !props.disabled" class="svg-container" viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="20" class="circle-box"></circle>
    </svg>

    <slot />
  </button>
</template>

<style scoped lang="scss">
@mixin button-styles($bg-color, $color, $border-color, $hover-bg, $hover-color, $hover-border, $active-bg, $active-color, $active-border, $loading-color) {
  background-color: $bg-color;
  color: $color;
  border-color: $border-color;

  // Hover 状态
  &:hover:not([disabled]):not(.oar-button--loading) {
    background-color: $hover-bg;
    color: $hover-color;
    border-color: $hover-border;
  }

  // Active 状态
  &:active:not([disabled]):not(.oar-button--loading) {
    background-color: $active-bg;
    border-color: $active-border;
    color: $active-color;
  }

  // Disabled 状态
  &:disabled {
    // background-color: $disabled-bg;
    // border-color: $disabled-bg;
    opacity: 0.5;
  }

  // Loading 样式
  // &.oar-button--loading {
  //   &::before {
  //     border-top-color: $loading-color !important;
  //     border-right-color: $loading-color !important;
  //   }
  // }
  .circle-box {
    stroke: $loading-color !important;
  }
}

.oar-button {
  margin-left: 12px;
  font-size: var(--oar-font-size);
  padding: 8px 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  text-align: center;
  user-select: none;
  font-family: inherit;
  line-height: 1.2;
  white-space: nowrap;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  &:disabled {
    cursor: not-allowed !important;
  }

  &--loading {
    cursor: wait;
    opacity: 0.75;
    &.is-default {
      pointer-events: none !important;
    }

    // &::before {
    //   content: '';
    //   display: inline-block;
    //   width: calc(var(--oar-font-size) - 1px);
    //   height: calc(var(--oar-font-size) - 1px);
    //   margin-right: 6px;
    //   // margin-left: 3px;
    //   border: 1px solid transparent;
    //   border-radius: 50%;
    //   box-sizing: border-box;
    //   animation: rotate-circle 1s linear infinite;
    //   border-top-color: var(--oar-text-color-black);
    //   border-right-color: var(--oar-text-color-black);
    // }
  }

  .svg-container {
    width: var(--oar-font-size);
    height: var(--oar-font-size);
    margin-right: 6px;
    display: inline;
    vertical-align: middle;
    animation: rotate-circle 2s linear infinite;
    transform-origin: center;

    .circle-box {
      fill: none;
      stroke: var(--oar-text-color-black);
      stroke-width: 2px;
      stroke-linecap: round;
      stroke-dashoffset: 0;
      stroke-dasharray: 90, 126;
      animation: flow 1.5s ease-in-out infinite;
    }
  }

  &--primary {
    border-radius: var(--oar-border-radius);
    border: 1px solid transparent;

    @include button-styles(var(--oar-primary-color), // 初始背景颜色
      var(--oar-text-color-white), // 初始文字颜色
      var(--oar-primary-color), // 初始边框颜色
      var(--oar-primary-color-hover), // hover 背景颜色
      var(--oar-text-color-white), // hover 文字颜色
      var(--oar-primary-color-hover), // hover 边框颜色
      var(--oar-primary-color-active), // active 背景颜色
      var(--oar-text-color-white), // active 文字颜色
      var(--oar-primary-color-active), // active 边框颜色
      var(--oar-text-color-white), // loading 颜色
    );

    &.is-plain {
      @include button-styles(var(--oar-primary-lighten-9), // 初始背景颜色
        var(--oar-primary-color), // 初始文字颜色
        var(--oar-primary-lighten-5), // 初始边框颜色
        var(--oar-primary-color), // hover 背景颜色
        var(--oar-text-color-white), // hover 文字颜色
        var(--oar-primary-color), // hover 边框颜色
        var(--oar-primary-color-active), // active 背景颜色
        var(--oar-text-color-white), // active 文字颜色
        var(--oar-primary-color-active), // active 边框颜色
        var(--oar-primary-lighten-5), // loading 颜色
      );
    }

    &.is-text {
      padding-left: 0;
      padding-right: 0;
      border: none;
      border-radius: 0;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        background-color: transparent;
        width: 0;
        height: 1px;
        transition: 0.3s all ease;
      }

      @include button-styles(transparent, // 初始背景颜色
        var(--oar-primary-color), // 初始文字颜色
        transparent, // 初始边框颜色
        transparent, // hover 背景颜色
        var(--oar-primary-color-hover), // hover 文字颜色
        transparent, // hover 边框颜色
        transparent, // active 背景颜色
        var(--oar-primary-color-active), // active 文字颜色
        transparent, // active 边框颜色
        var(--oar-primary-lighten-5), // loading 颜色
      );

      &:hover:not([disabled]):not(.oar-button--loading) {
        &::after {
          width: 100%;
          background-color: var(--oar-primary-color-hover) !important;
        }
      }

      &:active:not([disabled]):not(.oar-button--loading) {
        &::after {
          background-color: var(--oar-primary-color-active) !important;
        }
      }
    }
  }
}

@keyframes rotate-circle {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes flow {
  0% {
    stroke-dasharray: 1, 126;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 126;
    stroke-dashoffset: -50px;
  }

  100% {
    stroke-dasharray: 1, 126;
    stroke-dashoffset: -126px;
  }
}

@-moz-document url-prefix() {
  .oar-button:disabled {
    opacity: 0.6;
  }
}
</style>
