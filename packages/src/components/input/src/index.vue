<script setup lang="ts">
import { Search, SquareX } from 'lucide-vue-next'
import { useNamespace } from '@OarUI/hooks'
import { ref, type Ref, useTemplateRef } from 'vue'
import { useFocusControls } from '@OarUI/hooks'
const ns = useNamespace('input')
const [model, modifiers] = defineModel({
  set(value: string) {
    if (modifiers.lowercase) {
      return value.toLowerCase()
    }
    return value
  },
})

// interface Props {
//   clearable: boolean
// }

// const props = withDefaults(defineProps<Props>(), {
//   clearable: false,
// })
const wrapperRef: Ref = ref();
const inputRef: Ref = ref();
const { isFocused, handlerClick } = useFocusControls(wrapperRef, inputRef);

// const handleClear = () => {
  // console.log('clear')
  // if (!isFocus.value) {
  //   inputRef.value?.focus()
  // }
  // if (model.value) model.value = ''
// }

</script>

<!-- 点击 outside之外才算失焦 -->
<template>
  <div ref="wrapperRef" @click="handlerClick" :class="[ns.b(), ns.is('focus', isFocused)]">
    <!-- <Search /> -->
    <input
      ref="inputRef"
      v-model="model"
      :class="[ns.e('inner')]"
      type="text"
      v-bind="$attrs"
    />

    <!-- <SquareX
      @click.stop="handleClear"
      stroke-width="1"
      :class="[ns.e('clear'), ns.is('show', !!model), ns.is('hide', !model)]"
    ></SquareX> -->
  </div>
</template>

<!-- 
* - 无图标 / 想一个vmodel 修饰符的功能
* 清空图标
* 搜索图标
* 密码框
* 文本域、自适应文本域
* 输入长度
-->

<style lang="scss" scoped>
.oar-input {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0px 10px;
  line-height: var(--oar-line-height);
  box-sizing: border-box;
  border-radius: var(--oar-border-radius);
  border: 1px solid var(--oar-border-color-light);
  transition: all 0.3s;
  min-width: 320px;
  vertical-align: middle;
  cursor: text;

  &:hover {
    border-color: var(--oar-border-color-hover);
    box-shadow: var(--oar-border-shadow);
  }
  &.is-focus {
    border-color: var(--oar-primary-color);
    box-shadow: var(--oar-border-shadow-primary);
    .oar-input__clear.is-show {
      @extend .is-show;
    }
  }
  // &:not(:focus-within) {
  //   .oar-input__clear {
  //     @extend .is-hide;
  //   }
  // }

  &__inner {
    padding: 8.6px 0px;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background-color: transparent;
    line-height: var(--oar-line-height);
    font-size: var(--oar-font-size);
    color: var(--oar-text-color);
    user-select: none;

    &::placeholder {
      color: var(--oar-text-color-placeholder);
    }
  }

  &__clear {
    cursor: pointer;
    width: 20px;
    height: 20px;
    margin-left: 2px;
    color: var(--oar-text-color-soft);
    transition:
      color 0.3s,
      opacity 0.3s;
    user-select: none;
    &:hover {
      color: var(--oar-border-color-hover);
    }
    &:active {
      color: var(--oar-border-color-active);
    }
  }

  .is-hide {
    opacity: 0;
    cursor: text;
  }
  .is-show {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
