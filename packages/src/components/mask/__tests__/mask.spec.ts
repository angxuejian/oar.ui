// Mask.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import Mask from '../src/index.vue' // 修改为你的路径

describe('Mask.vue', () => {
  it('should not render when show=false', () => {
    const wrapper = mount(Mask, {
      props: {
        show: false,
      },
    })

    expect(wrapper.find('.oar-mask').exists()).toBe(false)
  })

  it('should render when show=true', () => {
    const wrapper = mount(Mask, {
      props: {
        show: true,
      },
    })

    expect(wrapper.find('.oar-mask').exists()).toBe(true)
  })

  it('should apply correct default class', () => {
    const wrapper = mount(Mask, {
      props: { show: true },
    })

    const mask = wrapper.find('.oar-mask')
    expect(mask.exists()).toBe(true)
    expect(mask.classes()).toContain('oar-mask')
  })

  it('should apply fixed class when to="body"', () => {
    mount(Mask, {
      attachTo: document.body,
      props: {
        to: 'body',
        show: true,
      },
    })
    const mask = document.body.querySelector('.oar-mask')!
    expect(mask.classList.contains('is-fixed')).toBe(true)
  })

  it('should apply absolute class when to != body', () => {
    const wrapper = mount(Mask, {
      props: {
        to: undefined,
        show: true,
      },
    })

    const mask = wrapper.find('.oar-mask')
    expect(mask.classes()).not.toContain('is-fixed')
  })

  it('should lock scroll on show', async () => {
    document.body.style.overflow = ''

    mount(Mask, {
      attachTo: document.body,
      props: {
        show: true,
        lockScroll: true,
        to: 'body',
      },
    })

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('should restore scroll after hide', async () => {
    document.body.style.overflow = ''

    const wrapper = mount(Mask, {
      attachTo: document.body,
      props: {
        show: true,
        lockScroll: true,
        to: 'body',
      },
    })

    await wrapper.setProps({ show: false })
    expect(document.body.style.overflow).toBe('')
  })

  it('should emit close event when clicking self', async () => {
    const wrapper = mount(Mask, {
      props: {
        show: true,
      },
    })

    const mask = wrapper.find('.oar-mask')
    await mask.trigger('click')

    // click.self 触发 close
    expect(wrapper.emitted()).toHaveProperty('close')
  })

  it('should not emit close when closeOnClick=false', async () => {
    const wrapper = mount(Mask, {
      props: {
        show: true,
        closeOnClick: false,
      },
    })

    const mask = wrapper.find('.oar-mask')
    await mask.trigger('click')

    expect(wrapper.emitted()).not.toHaveProperty('close')
  })

  it('should close when ESC is pressed', async () => {
    const wrapper = mount(Mask, {
      props: {
        show: true,
      },
    })

    await wrapper.find('.oar-mask').trigger('keydown', {
      key: 'Escape',
    })

    expect(wrapper.emitted()).toHaveProperty('close')
  })

  it('should focus mask after enter (before-enter + nextTick)', async () => {
    const wrapper = mount(Mask, {
      attachTo: document.body,
      props: {
        show: true,
      },
    })

    await nextTick()
    const mask = wrapper.find('.oar-mask')
    mask.element.focus()

    expect(document.activeElement).toBe(mask.element)
  })

  it('should expose close() method', async () => {
    const wrapper = mount(Mask, {
      props: {
        show: true,
      },
    })

    ;(wrapper.vm as any).close()

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted()).toHaveProperty('close')
  })
})
