// Scrollbar.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Scrollbar from '../src/index.vue' // 路径请根据你的项目结构调整

describe('Scrollbar.vue', () => {
  it('should render correctly with default props', () => {
    const wrapper = mount(Scrollbar)

    // 默认应该启用 scrollY 和 scrollX
    const wrap = wrapper.find('.oar-scrollbar__warp')
    expect(wrap.classes()).toContain('is-scroll')
  })

  it('should render scrollY only when scrollY is true and scrollX is false', () => {
    const wrapper = mount(Scrollbar, {
      props: {
        scrollY: true,
        scrollX: false,
      },
    })

    const wrap = wrapper.find('.oar-scrollbar__warp')
    expect(wrap.classes()).toContain('is-scroll-y')
    expect(wrap.classes()).not.toContain('is-scroll-x')
    expect(wrap.classes()).not.toContain('is-scroll')
  })

  it('should render scrollX only when scrollX is true and scrollY is false', () => {
    const wrapper = mount(Scrollbar, {
      props: {
        scrollX: true,
        scrollY: false,
      },
    })

    const wrap = wrapper.find('.oar-scrollbar__warp')
    expect(wrap.classes()).toContain('is-scroll-x')
    expect(wrap.classes()).not.toContain('is-scroll-y')
    expect(wrap.classes()).not.toContain('is-scroll')
  })

  it('should apply always class to thumbs when always is true', () => {
    const wrapper = mount(Scrollbar, {
      props: {
        always: true,
      },
    })

    const verticalThumb = wrapper.find('.oar-scrollbar__thumb')
    expect(verticalThumb.classes()).toContain('is-always')
  })

  it('should emit scroll event on scroll', async () => {
    const wrapper = mount(Scrollbar)
    const wrap = wrapper.find('.oar-scrollbar__warp')

    await wrap.trigger('scroll')

    expect(wrapper.emitted()).toHaveProperty('scroll')
  })

  it('should expose setScrollTop and setScrollLeft', async () => {
    const wrapper = mount(Scrollbar)
    const vm = wrapper.vm as any

    // mock wrapRef
    vm.ref = {
      scrollTop: 0,
      scrollLeft: 0,
    }

    // 测试 setScrollTop / setScrollLeft 是否可调用
    expect(() => vm.setScrollTop(50)).not.toThrow()
    expect(() => vm.setScrollLeft(100)).not.toThrow()
  })

  it('should render slot content', () => {
    const wrapper = mount(Scrollbar, {
      slots: {
        default: '<div class="content">Hello Scroll</div>',
      },
    })

    expect(wrapper.find('.content').exists()).toBe(true)
    expect(wrapper.find('.content').text()).toBe('Hello Scroll')
  })
})
