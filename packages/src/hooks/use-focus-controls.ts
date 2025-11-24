import { ref, type Ref, watch } from 'vue'

type eventListType = {
  afterFocus?: (e: FocusEvent) => void
  afterBlur?: (e: FocusEvent) => void
}

/**
 * useFocusControls
 * 用于管理组件的焦点控制逻辑，支持自定义聚焦和失焦事件。
 *
 * @param wrapperRef - 外层容器的 ref
 * @param targetRef - 需要聚焦的目标元素 ref
 * @param eventListType - 可选，包含 afterFocus 和 afterBlur 回调
 * @returns { isFocused, handleClick, handleFocus, handleBlur }
 *   - isFocused: 当前是否聚焦
 *   - handleClick: 点击时聚焦目标元素
 *   - handleFocus: 聚焦事件处理
 *   - handleBlur: 失焦事件处理
 */
export function useFocusControls(
  wrapperRef: Ref<HTMLElement>,
  targetRef: Ref<HTMLElement>,
  { afterFocus, afterBlur }: eventListType = {},
) {
  watch(wrapperRef, (el) => {
    if (el) {
      el.setAttribute('tabindex', '-1')
    }
  })

  const isFocused = ref(false)

  const handleFocus = (e: FocusEvent) => {
    if (isFocused.value) return

    isFocused.value = true
    afterFocus?.(e)
  }

  const handleBlur = (e: FocusEvent) => {
    if (e.relatedTarget && wrapperRef.value?.contains(e.relatedTarget as Node)) return

    isFocused.value = false
    afterBlur?.(e)
  }

  const handleClick = () => {
    if (!targetRef.value) return

    targetRef.value.focus()
  }

  return { isFocused, handleClick, handleFocus, handleBlur }
}
