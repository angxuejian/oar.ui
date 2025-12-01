<script lang="ts" setup>
import { computed, ref, onUnmounted, nextTick, watch } from 'vue'
import { type UseCommonProps, useNamespace } from '@OarUI/hooks'

interface Props {
  to?: string | HTMLElement
  lockScroll?: boolean
  closeOnClick?: boolean
  opacity?: number
}

interface Emits {
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props & UseCommonProps>(), {
  lockScroll: true,
  closeOnClick: true,
  opacity: 0.5,
})
const emits = defineEmits<Emits>()

// const THEME_DEFAULT = useCommonComputed(props)
const ns = useNamespace('mask')

const show = defineModel<boolean>('show', { default: false })
const maskRef = ref<HTMLElement | null>(null)
const didEnter = ref(false)

let prevOverflow: string | null = null

const isFixed = computed(() => {
  if (props.to === 'body') return true
  else if (props.to === document.body) return true
  else return false
})
const maskStyle = computed(() => {
  return {
    'background-color': `rgba(0, 0, 0, ${props.opacity})`,
    'z-index': 2000,
  }
})

const enterInit = async () => {
  if (didEnter.value) return
  didEnter.value = true

  if (props.lockScroll) {
    lockBodyScroll()
  }

  await nextTick()
  maskRef.value?.focus()
}

const leaveReset = () => {
  didEnter.value = false
  unlockBodyScroll()
}

const lockBodyScroll = () => {
  if (!props.lockScroll || prevOverflow !== null || !didEnter.value) return

  prevOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
}

const unlockBodyScroll = () => {
  if (!props.lockScroll || prevOverflow === null || didEnter.value) return

  document.body.style.overflow = prevOverflow ?? ''
  prevOverflow = null
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    handleClose()
  }
}

const handleClose = () => {
  if (props.closeOnClick) {
    close()
  }
}

const close = () => {
  show.value = false
  emits('close')
}

watch(
  show,
  (newV) => {
    if (props.lockScroll) {
      if (newV) enterInit()
      else leaveReset()
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  leaveReset()
})

defineExpose({
  close,
})
</script>

<template>
  <Teleport :disabled="!props.to" :to="props.to">
    <Transition name="fade" @before-enter="enterInit" @after-leave="leaveReset">
      <div
        v-if="show"
        ref="maskRef"
        tabindex="-1"
        @keydown="handleKeydown"
        @click.self="handleClose"
        role="dialog"
        aria-modal="true"
        :class="[ns.b(), ns.is('fixed', isFixed)]"
        :style="maskStyle"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@include b('mask') {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  @include is('fixed') {
    position: absolute;
  }
}
</style>
