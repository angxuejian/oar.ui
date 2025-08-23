import type { DirectiveBinding } from "vue";

export type handlerType = (e: TouchEvent | MouseEvent) => void

declare global {
  interface HTMLElement {
    __touchHandler__?: (e: TouchEvent) => void;
    __clickHandler__?: (e: MouseEvent) => void;
  }
}

/**
 * vClick 自定义指令
 * 兼容移动端和桌面端的点击事件，防止同一操作触发两次（如移动端先触发 touchstart 再触发 click）。
 *
 * 用法：v-click="handler"
 * handler 会在 touchstart 或 click 时被调用，但不会重复触发。
 */
export const vClick = {
  mounted(el: HTMLElement, binding: DirectiveBinding<handlerType>) {
    let touched = false;

    const handler = binding.value

    const touchHandler = (e: TouchEvent) => {
      touched = true
      handler(e)
    }

    const clickHandler = (e: MouseEvent) => {
      if (!touched) {
        handler(e)
      }

      touched = false
    }

    el.__touchHandler__ = touchHandler;
    el.__clickHandler__ = clickHandler;

    el.addEventListener('touchstart', el.__touchHandler__, { passive: false })
    el.addEventListener('click', el.__clickHandler__)

  },

  beforeUnmount(el: HTMLElement) {

    if (el.__touchHandler__) {
      el.removeEventListener('touchstart', el.__touchHandler__)
      delete el.__touchHandler__
    }

    if (el.__clickHandler__) {
      el.removeEventListener('click', el.__clickHandler__)
      delete el.__clickHandler__
    }
  }
}
