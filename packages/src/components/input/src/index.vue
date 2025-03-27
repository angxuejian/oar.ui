<script setup lang="ts">
import { SquareX, Eye, EyeClosed } from 'lucide-vue-next'
import { ref, type Ref, computed } from 'vue'
import { type UseCommonProps, useCommonComputed, useFocusControls, useNamespace } from '@OarUI/hooks'
const ns = useNamespace('input')

const [model, modifiers] = defineModel({
  set(value: string) {
    if (modifiers.lowercase) {
      return value.toLowerCase()
    }
    return value
  },
})
const emit = defineEmits(['focus', 'blur', 'input', 'clear'])


interface Props {
  clearable?: boolean,
  placeholder?: string,
  type?: 'text' | 'password',
  maxlength?: number | string,
  readonly?: boolean,
  disabled?: boolean
}

const props = withDefaults(defineProps<Props & UseCommonProps>(), {
  type: 'text',
  clearable: false,
  placeholder: '',
})
const THEME_DEFAULT = useCommonComputed(props);

const modelLength = computed(() => {
  return typeof model.value === 'string' ? model.value.length : 0
})
const inputMaxlength = computed(() => {
  const n = typeof props.maxlength !== 'undefined' ? absRoundNumber(props.maxlength) : NaN
  return Number.isNaN(n) ? undefined : n
});
const inputType = computed(() => {
  if (props.type === 'password') {
    if (isShowPassword.value) return 'text';
    else return 'password'
  } else {
    return props.type
  }
})

const isShowPassword = ref<boolean>(false);
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

const absRoundNumber = (num: string | number) : number => {
  return Math.abs(Math.round(Number(num)))
};

const handleInput = (e: Event) => {
  emit('input', e)
}

const handleClear = () => {
  if (model.value && isFocused.value) {
    clear()
  }
}

const clear = () => {
  model.value = ''
  emit('clear')
}


defineExpose({ ref: inputRef, clear, focus: () => inputRef.value.focus(), blur: () => inputRef.value.blur() })
</script>

<template>
  <input
      v-if="THEME_DEFAULT"
      ref="inputRef"
      v-model="model"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
      v-on="$attrs"
      v-bind="$attrs"
      :class="[ns.e('default')]"
      :placeholder="props.placeholder"
      :maxlength="inputMaxlength"
      :readonly="props.readonly"
      :disabled="props.disabled"
      :type="inputType"
    />

  <div v-else ref="wrapperRef" @click="handleClick" :class="[ns.b(), ns.is('focus', isFocused), ns.is('disabled', props.disabled)]">
    <input
      ref="inputRef"
      v-model="model"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
      v-on="$attrs"
      v-bind="$attrs"
      :class="[ns.e('inner')]"
      :placeholder="props.placeholder"
      :maxlength="inputMaxlength"
      :readonly="props.readonly"
      :disabled="props.disabled"
      :type="inputType"
    />

    <template v-if="props.clearable">
      <SquareX
        @click="handleClear"
        :class="[
          ns.e('clear'),
          ns.is('show', isFocused && !!model),
          ns.is('hide', !isFocused || !model),
        ]"
      ></SquareX>
    </template>

    <template v-if="props.type === 'password'">
      <component :class="[
        ns.e('eye'),
        ns.is('show', !!model),
        ns.is('hide', !model),
        ns.is('left', props.clearable)
      ]" @click="isShowPassword = !isShowPassword" :is="isShowPassword ? Eye : EyeClosed"></component>
    </template>

    <template v-if="inputMaxlength">
      <span :class="ns.e('length')">{{ modelLength }} / {{ inputMaxlength }}</span>
    </template>
  </div>
</template>


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
  &.is-disabled {
    background-color: var(--oar-text-color-disabled);
    cursor: not-allowed;
    & * {
      cursor: not-allowed !important;
      pointer-events: none;
    }
  }

  &__default {
    min-width: 320px;
    padding: 8.6px 10px;
    box-sizing: border-box;
    line-height: var(--oar-line-height);
    font-size: var(--oar-font-size);
    color: var(--oar-text-color);
    &::placeholder {
      color: var(--oar-text-color-placeholder);
    }
  }

  &__inner {
    padding: 8.6px 0px;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    flex: 1;
    background-color: transparent;
    line-height: var(--oar-line-height);
    font-size: var(--oar-font-size);
    color: var(--oar-text-color);
    user-select: none;

    &::placeholder {
      color: var(--oar-text-color-placeholder);
    }
    &[type="password"]::-webkit-toggle-password { /*chrome*/
      -webkit-appearance: none!important;
      display: none!important;
    }
    &[type="password"]::-moz-ui-password { /*firefox*/
      -moz-appearance: none!important;
      display: none!important;
    }
    &[type="password"]::-ms-reveal { /*edge*/
      display: none!important;
    }
  }


  .icon {
    cursor: pointer;
    width: 17px;
    height: 20px;
    color: var(--oar-text-color-soft);
    transition:
      color 0.3s,
      opacity 0.3s;
    user-select: none;
  }

  &__clear {
    @extend .oar-input__eye;
    &:hover {
      color: var(--oar-border-color-hover);
    }
    &:active {
      color: var(--oar-border-color-active);
    }
  }

  &__eye {
    cursor: pointer;
    width: 17px;
    height: 20px;
    color: var(--oar-text-color-soft);
    margin-left: 4px;
    transition:
      color 0.3s,
      opacity 0.3s;
    user-select: none;
  }


  &__length {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    font-size: 11px;
    white-space: nowrap;
    user-select: none;
    @extend .is-left;
    color: var(--oar-text-color-soft);
  }


  .is-hide {
    opacity: 0;
    cursor: text;
  }
  .is-show {
    opacity: 1;
    pointer-events: auto;
  }
  .is-left {
    margin-left: 8px;
  }
}
</style>
