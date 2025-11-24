// Window.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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

describe('Window-touchevent.vue', () => {
  it('should start dragging on touchstart', async () => {
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

    const header = wrapper.find('h5')
    await header.trigger('touchstart', {
      touches: [{ clientX: 10, clientY: 20 }],
    })

    expect(wrapper.vm.isDragging).toBe(true)
  })

  it('should update targetPosition on touchmove', async () => {
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

    // mock container & element rect
    vi.spyOn(document, 'querySelector').mockReturnValue(document.body)

    vi.spyOn(document.body, 'getBoundingClientRect').mockReturnValue({
      width: 800,
      height: 600,
    })
    vi.spyOn(wrapper.vm.windowRef!, 'getBoundingClientRect').mockReturnValue({
      width: 200,
      height: 200,
    })

    await wrapper.vm.$nextTick()
    await vi.runAllTimers()

    await wrapper.find('h5').trigger('touchstart', {
      touches: [{ clientX: 100, clientY: 100 }],
    })

    // simulate move
    const event = new TouchEvent('touchmove', {
      touches: [{ clientX: 150, clientY: 200 }],
    })
    window.dispatchEvent(event)

    expect(wrapper.vm.targetPosition.x).not.toBe(0)
    expect(wrapper.vm.targetPosition.y).not.toBe(0)
  })

  it('should stop dragging on touchend', async () => {
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

    await wrapper.find('h5').trigger('touchstart', {
      touches: [{ clientX: 10, clientY: 10 }],
    })
    expect(wrapper.vm.isDragging).toBe(true)

    window.dispatchEvent(new TouchEvent('touchend'))
    expect(wrapper.vm.isDragging).toBe(false)
  })

  it('should stop dragging on touchcancel', async () => {
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

    const header = wrapper.find('h5')
    header.element.dispatchEvent(
      new TouchEvent('touchstart', {
        touches: [{ clientX: 40, clientY: 60 }],
      }),
    )

    expect(wrapper.vm.isDragging).toBe(true)

    window.dispatchEvent(new TouchEvent('touchcancel'))

    expect(wrapper.vm.isDragging).toBe(false)
  })
})
