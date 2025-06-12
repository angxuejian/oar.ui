import { onMounted, onBeforeUnmount, type Ref } from "vue";

/**
 * 自定义hook：为传入的元素ref绑定点击（click）和触摸（touchstart）事件
 * 兼容移动端和PC端，防止同一操作被触发两次
 * @param elRef 目标元素的ref or dom节点
 * @param handler 事件回调函数，参数类型为TouchEvent or MouseEvent
 */
export function useClick(elRef: Ref | HTMLElement, handler: (event: TouchEvent | MouseEvent) => void) {
  let touched = false;

  const touchHandler = (e: TouchEvent) => {
    touched = true;
    handler(e)
  }

  const clickHandler = (e: MouseEvent) => {
    if (!touched) {
      handler(e)
    }

    touched = false
  }

  onMounted(() => {
    const el = elRef instanceof HTMLElement ? elRef : elRef.value;
    if (!el) return;

    el.addEventListener('touchstart', touchHandler, {
      passive: false, // 为了让 preventDefault() 有效，防止IOS滚动等默认行为
    })

    el.addEventListener('click', clickHandler)
  })

  onBeforeUnmount(() => {
    const el = elRef instanceof HTMLElement ? elRef : elRef.value;
    if (!el) return;

    el.removeEventListener('touchstart', touchHandler)
    el.removeEventListener('click', clickHandler)
  })
}
