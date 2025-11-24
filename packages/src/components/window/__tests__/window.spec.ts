// Window.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import Window from '../src/index.vue'

// mock requestAnimationFrame
beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('requestAnimationFrame', (cb) => setTimeout(cb, 16))
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
})

// 清理 mock
afterEach(() => {
  vi.clearAllMocks()
  vi.useRealTimers()
})

describe('Window.vue', () => {
  it('should render only when show = true', async () => {
    const wrapper = mount(Window, {
      attachTo: document.body,
      global: {
        stubs: {
          teleport: true,
        },
      },
      props: {
        show: false,
        width: 200,
        height: 200,
      },
    })

    expect(wrapper.find('.oar-window').exists()).toBe(false)

    await wrapper.setProps({ show: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.oar-window').exists()).toBe(true)
  })

  it('should apply namespace class "oar-window"', async () => {
    const wrapper = mount(Window, {
      attachTo: document.body,
      global: {
        stubs: {
          teleport: true,
        },
      },
      props: {
        show: true,
        width: 200,
        height: 200,
      },
    })

    expect(wrapper.find('.oar-window').exists()).toBe(true)
  })

  it('should use defaultPosition when center = false', async () => {
    // mock containerRect
    const fakeContainer = document.createElement('div')
    fakeContainer.style.width = '800px'
    fakeContainer.style.height = '600px'
    document.body.append(fakeContainer)

    // patch querySelector
    vi.spyOn(document, 'querySelector').mockReturnValue(fakeContainer)

    // mock getBoundingClientRect
    vi.spyOn(fakeContainer, 'getBoundingClientRect').mockReturnValue({
      width: 800,
      height: 600,
      x: 0,
      y: 0,
    })
    const wrapper = mount(Window, {
      attachTo: document.body,
      global: {
        stubs: { teleport: true },
      },
      props: {
        show: true,
        center: false,
        width: 300,
        height: 300,
        defaultPosition: { x: 50, y: 100 },
      },
    })

    vi.spyOn(wrapper.vm.windowRef!, 'getBoundingClientRect').mockReturnValue({
      width: 200,
      height: 100,
    })

    await wrapper.vm.$nextTick() // 等待 watch(show) 完成
    await vi.runAllTimers() // 等待 requestAnimationFrame
    await vi.runAllTimers() // 等待 requestAnimationFrame
    await nextTick() // 等待 computed

    const style = wrapper.find('.oar-window').attributes('style')
    expect(style).toContain('translate(50px, 100px)')
  })

  it('should center window when center = true', async () => {
    // mock containerRect
    const fakeContainer = document.createElement('div')
    fakeContainer.style.width = '800px'
    fakeContainer.style.height = '600px'
    document.body.append(fakeContainer)

    // patch querySelector
    vi.spyOn(document, 'querySelector').mockReturnValue(fakeContainer)

    // mock getBoundingClientRect
    vi.spyOn(fakeContainer, 'getBoundingClientRect').mockReturnValue({
      width: 800,
      height: 600,
      x: 0,
      y: 0,
    })

    const wrapper = mount(Window, {
      attachTo: document.body,
      global: {
        stubs: {
          teleport: true,
        },
      },
      props: {
        show: true,
        center: true,
        width: 200,
        height: 100,
      },
    })

    // mock the window size
    vi.spyOn(wrapper.vm.windowRef!, 'getBoundingClientRect').mockReturnValue({
      width: 200,
      height: 100,
    })

    await wrapper.vm.$nextTick()
    await vi.runAllTimers()
    await vi.runAllTimers()
    await nextTick()

    const style = wrapper.find('.oar-window').attributes('style')
    expect(style).toContain('translate(300px, 250px)')
  })

  it('should close window when X button clicked', async () => {
    const wrapper = mount(Window, {
      attachTo: document.body,
      global: {
        stubs: {
          teleport: true,
        },
      },
      props: {
        show: true,
        width: 100,
        height: 100,
      },
    })

    await wrapper.vm.$nextTick()

    await wrapper.find('.oar-window__tab-btn-icon').trigger('click')

    expect(wrapper.emitted()['update:show'][0]).toEqual([false])
  })

  it('should apply contentClass', async () => {
    const wrapper = mount(Window, {
      attachTo: document.body,
      global: {
        stubs: {
          teleport: true,
        },
      },
      props: {
        show: true,
        width: 200,
        height: 200,
        contentClass: 'custom-content',
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('.custom-content').exists()).toBe(true)
  })

  it('should apply width & height to content style', async () => {
    const wrapper = mount(Window, {
      attachTo: document.body,
      global: {
        stubs: {
          teleport: true,
        },
      },
      props: {
        show: true,
        width: 300,
        height: 150,
      },
    })

    await wrapper.vm.$nextTick()

    const content = wrapper.find('.oar-window__content')
    const style = content.attributes('style')

    expect(style).toContain('width: 300px')
    expect(style).toContain('height: 150px')
  })
})
