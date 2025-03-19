<script setup lang="ts">
import { SquareX } from 'lucide-vue-next'
import { useNamespace } from '@OarUI/hooks'
import { ref, type Ref } from 'vue'
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
const emit = defineEmits(['focus', 'blur'])


interface Props {
  clearable?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  clearable: false,
  placeholder: '',
})

const wrapperRef: Ref = ref()
const inputRef: Ref = ref()
const { isFocused, handleClick, handleBlur, handleFocus } = useFocusControls(wrapperRef, inputRef, {
  afterFocus(e) {
    emit('focus', e)
  },
  afterBlur(e) {
    emit('blur', e)
  },
})

const handleClear = () => {
  if (model.value && isFocused.value) {
    model.value = ''
  }
}
</script>

<template>
  <div ref="wrapperRef" @click="handleClick" :class="[ns.b(), ns.is('focus', isFocused)]">
    <!-- <Search /> -->
    <input
      ref="inputRef"
      v-model="model"
      @blur="handleBlur"
      @focus="handleFocus"
      :class="[ns.e('inner')]"
      :placeholder="props.placeholder"
      type="text"
    />

    <template v-if="props.clearable">
      <SquareX
        @click="handleClear"
        stroke-width="1"
        :class="[
          ns.e('clear'),
          ns.is('show', isFocused && !!model),
          ns.is('hide', !isFocused || !model),
        ]"
      ></SquareX>
    </template>
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
  }


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
