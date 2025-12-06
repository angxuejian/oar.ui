<script lang="ts" setup>
import { computed, inject, watch } from 'vue'
import { type UseCommonProps, useCommonComputed, useNamespace } from '@OarUI/hooks'
import { ChevronDown } from 'lucide-vue-next'
import { CollapseProvide } from './type'

interface Props {
  name?: string;
  title?: string;
  maxHeight?: number | string;
  disabled?: boolean;
}

interface Emits {
  (e: 'change', value: boolean): void
}

const props = withDefaults(defineProps<Props & UseCommonProps>(), {
  title: '',
  disabled: false
})
const emits = defineEmits<Emits>()
const THEME_DEFAULT = useCommonComputed(props)
const ns = useNamespace('collapse')
const expand = defineModel<boolean>('expand', { default: false })
const collapseGroup = inject(CollapseProvide, null)

const contentStyle = computed(() => {
  const style: { [key: string]: string } = {}

  if (props.maxHeight) {
    if (typeof props.maxHeight === 'number') {
      style['max-height'] = `${props.maxHeight}px`
    } else {
      style['max-height'] = props.maxHeight
    }
    style['overflow-y'] = 'auto'
  }
  return style
})

const show = computed(() => {
  if (!collapseGroup) return expand.value

  // 手风琴模式：只有一个 name 会被开启
  if (collapseGroup.accordion) {
    return props.name === collapseGroup.select.value
  } else {
    return props.name ? collapseGroup.selectAll[props.name] : false
  }
})

watch(() => collapseGroup?.select.value, (newV) => {
  if (!collapseGroup || collapseGroup.accordion || !props.name) return

  collapseGroup.selectAll[props.name] = props.name === newV
}, { immediate: true })

const handleExpand = () => {
  const disabled = collapseGroup?.disabled || props.disabled

  if (disabled) return
  if (collapseGroup) {
    if (collapseGroup.accordion) {
      collapseGroup.handleSelect(props.name)
    } else {
      collapseGroup.handleSelectAll(props.name)
    }

  } else {
    expand.value = !expand.value
    emits('change', expand.value)
  }
}

</script>


<template>
  <div :class="[ns.b(), ns.is('expand', show), ns.is('disabled', props.disabled)]" role="button"
    :tabindex="props.disabled ? -1 : 0" :aria-expanded="expand" :aria-disabled="props.disabled">
    <div @click="handleExpand" :class="ns.e('header')">
      <h5 :class="ns.e('title')">
        <slot name="title">{{ props.title }}</slot>
      </h5>

      <div :class="ns.e('arrow')">
        <slot name="icon" :expand="expand">
          <ChevronDown :size="20" />
        </slot>
      </div>
    </div>

    <div :class="ns.e('main')">
      <div :style="contentStyle" :class="ns.e('content')">
        <slot />
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
@include b('collapse') {
  border-radius: var(--oar-border-radius-medium);
  overflow: hidden;
  border: 1px solid var(--oar-border-color-light);
  box-sizing: border-box;

  @include e('header') {
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
    background-color: var(--oar-primary-color);
    border-bottom: 1px solid var(--oar-primary-color);
    cursor: pointer;
    transition: background-color 0.3s ease;
    user-select: none;
    color: var(--oar-white);

    &:hover {
      background-color: var(--oar-primary-color-hover);
    }

    &:active {
      background-color: var(--oar-primary-color-active);
    }
  }

  @include e('title') {
    flex: 1;
    padding-left: 5px;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 100%;
    margin: 0;
  }

  @include e('arrow') {
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(0deg);
    transition: transform 0.3s ease-in-out;
  }

  @include e('main') {
    background-color: var(--oar-white);
    display: grid;
    grid-template-rows: 0fr;
    overflow: hidden;
    transition: grid-template-rows 0.3s ease-in-out;
  }

  @include e('content') {
    min-height: 0;
    padding: 0;
    transition: padding 0.3s ease, opacity 0.3s ease-in-out;
    box-sizing: border-box;
    opacity: 0;
  }

  @include is('expand') {
    @include be('collapse', 'arrow') {
      transform: rotate(-180deg);
    }

    @include be('collapse', 'main') {
      grid-template-rows: 1fr;
    }

    @include be('collapse', 'content') {
      padding: 4px 8px;
      opacity: 1;
    }
  }

  @include is('disabled') {
    opacity: 0.6;
    cursor: not-allowed;

    @include be('collapse', 'header') {
      cursor: not-allowed;
      background-color: var(--oar-primary-color-disabled);
    }
  }
}
</style>
