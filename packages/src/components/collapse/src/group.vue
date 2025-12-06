<script lang="ts" setup>
import { computed, provide, reactive, toRaw } from 'vue'
import { CollapseProvide, type selectAllType } from './type'
import { type UseCommonProps, useCommonComputed, useNamespace } from '@OarUI/hooks'

interface Props {
  disabled?: boolean;
  accordion?: boolean
}

interface Emits {
  (e: 'change', select: string | selectAllType): void
}

const props = withDefaults(defineProps<Props & UseCommonProps>(), {
  disabled: false,
  accordion: true
})
const emits = defineEmits<Emits>()
const ns = useNamespace('collapse-group')
const select = defineModel<string>('select', { default: '' })
const selectAll = reactive<selectAllType>({})

const handleSelect = (name: string | undefined) => {

  if (name && name !== select.value) {
    select.value = name
  } else {
    select.value = ''
  }
  emits('change', select.value)
}

const handleSelectAll = (name: string | undefined) => {
  if (name) {
    selectAll[name] = !selectAll[name]
    emits('change', toRaw(selectAll))
  }
}

provide(CollapseProvide, { select, selectAll, accordion: props.accordion, disabled: props.disabled, handleSelect, handleSelectAll })
</script>

<template>
  <div :class="[ns.b(), ns.is('disabled', props.disabled)]">
    <slot />
  </div>
</template>

<style lang="scss">
@include b('collapse-group') {
  border-radius: var(--oar-border-radius-medium);
  overflow: hidden;
  border: 1px solid var(--oar-border-color-light);
  box-sizing: border-box;

  @include b('collapse') {
    border-color: transparent !important;
    border-radius: 0 !important;

    &:nth-child(1) {
      border-radius: var(--oar-border-radius-medium) var(--oar-border-radius-medium) 0 0 !important;
    }

    &:nth-last-child(1) {
      border-radius: 0 0 var(--oar-border-radius-medium) var(--oar-border-radius-medium) !important;

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
