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
    [`is-plain`]: !THEME_DEFAULT.value && props.plain,
    [`is-text`]: !THEME_DEFAULT.value && !props.plain && props.text
  }
});

</script>

<template>
  <button v-on="$attrs" class="oar-button" :class="buttonClass" :disabled="disabled">
    <span v-if="props.loading && !props.disabled" class="loading-circle"></span>
    <slot />
  </button>
</template>

<style scoped lang="scss">
@mixin button-styles($bg-color, $color, $border-color, $hover-bg, $hover-color, $hover-border, $active-bg, $active-color, $active-border, $loading-color) {
  background-color: $bg-color;
  color: $color;
  border-color: $border-color;

  // Hover 状态
  &:hover:not([disabled]) {
    background-color: $hover-bg;
    color: $hover-color;
    border-color: $hover-border;
  }

  // Active 状态
  &:active:not([disabled]) {
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
  .loading-circle {
    border-top-color: $loading-color;
    border-right-color: $loading-color;
  }
}

.oar-button {
  margin-left: 12px;
  font-size: var(--oar-font-size);
  padding: 8px 15px;
  display: inline-block !important;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  font-family: inherit;
  line-height: 1.2;
  white-space: nowrap;
  box-sizing: border-box;

  &:disabled {
    cursor: not-allowed !important;
  }

  .loading-circle {
    border-top-color: var(--oar-text-color-black);
    border-right-color: var(--oar-text-color-black);
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
      var(--oar-text-color-white),    // active 文字颜色
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
        var(--oar-text-color-white),    // active 文字颜色
        var(--oar-primary-color-active), // active 边框颜色
        var(--oar-primary-lighten-5), // loading 颜色
      );
    }

    &.is-text {
      padding: 0;
      border: none;
      @include button-styles(transparent, // 初始背景颜色
        var(--oar-primary-color),         // 初始文字颜色
        transparent,                      // 初始边框颜色
        transparent,                      // hover 背景颜色
       var(--oar-primary-color-hover),    // hover 文字颜色
        transparent,                      // hover 边框颜色
        transparent,                      // active 背景颜色
        var(--oar-primary-color-active),  // active 文字颜色
        transparent,                      // active 边框颜色
        var(--oar-primary-lighten-5),     // loading 颜色
      );
    }
  }

  &--loading {
    pointer-events: none;
    cursor: auto;
    opacity: 0.75;
  }
}

.loading-circle {
  width: var(--oar-font-size);
  height: var(--oar-font-size);
  display: inline-block;
  border: 1px solid transparent;
  border-radius: 50%;
  animation: rotate-circle 1s linear infinite;
  margin-right: 6px;
}

@keyframes rotate-circle {
  0% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(180deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@-moz-document url-prefix() {
  .oar-button:disabled {
    opacity: 0.6;
  }
}
</style>
