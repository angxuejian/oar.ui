import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Joystick from '../src/index.vue'

describe('Joystick.vue', () => {
  it('should render with default size', () => {
    const wrapper = mount(Joystick)
    const root = wrapper.find('.oar-joystick')
    expect(root.attributes('style')).toContain('width: 180px')
    expect(root.attributes('style')).toContain('height: 180px')
  })

  it('should render with custom width and height', () => {
    const wrapper = mount(Joystick, {
      props: { width: 200, height: 150 },
    })
    const root = wrapper.find('.oar-joystick')
    expect(root.attributes('style')).toContain('width: 200px')
    expect(root.attributes('style')).toContain('height: 150px')
  })

  it('should render keyboard keys', () => {
    const wrapper = mount(Joystick)
    expect(wrapper.find('.oar-joystick__keyborad--w').text()).toBe('W')
    expect(wrapper.find('.oar-joystick__keyborad--a').text()).toBe('A')
    expect(wrapper.find('.oar-joystick__keyborad--s').text()).toBe('S')
    expect(wrapper.find('.oar-joystick__keyborad--d').text()).toBe('D')
  })

  it('should emit "change" event when moved by mouse', async () => {
    const wrapper = mount(Joystick, {
      attachTo: document.body, // 为了正确获取 getBoundingClientRect
    })

    const outside = wrapper.find('.oar-joystick__outside')

    // 模拟真实 DOM 尺寸
    Object.defineProperty(wrapper.vm.$refs.outsideRef, 'getBoundingClientRect', {
      value: () => ({
        left: 100,
        top: 100,
        width: 200,
        height: 200,
      }),
    })

    Object.defineProperty(wrapper.vm.$refs.innsideRef, 'getBoundingClientRect', {
      value: () => ({
        width: 50,
        height: 50,
      }),
    })

    await outside.trigger('mousedown', {
      clientX: 150,
      clientY: 100,
      button: 0,
    })

    window.dispatchEvent(new MouseEvent('mousemove', {
      clientX: 170,
      clientY: 80,
    }))

    window.dispatchEvent(new MouseEvent('mouseup'))

    const emits = wrapper.emitted('change')
    expect(emits).toBeTruthy()
    expect(emits?.[0]?.[0]).toHaveProperty('direction')
    wrapper.unmount()
  })

  it('should emit "change" event when key W is pressed', async () => {
    const wrapper = mount(Joystick)

    await window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }))
    await new Promise(resolve => setTimeout(resolve, 20))
    await window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w' }))

    const emits = wrapper.emitted('change')
    expect(emits).toBeTruthy()
    expect(emits?.[0]?.[0]).toMatchObject({
      isForward: true,
      direction: 'forward'
    })
  })

  it('should reset position on blur', async () => {
    const wrapper = mount(Joystick)
    const vm = wrapper.vm as any

    vm.position.x = 10
    vm.position.y = 10

    await window.dispatchEvent(new Event('blur'))

    expect(vm.position.x).toBe(0)
    expect(vm.position.y).toBe(0)
  })

  it('should not respond to mouse button other than left click', async () => {
    const wrapper = mount(Joystick)
    const outside = wrapper.find('.oar-joystick__outside')
    await outside.trigger('mousedown', { button: 1 }) // right click
    const vm = wrapper.vm as any
    expect(vm.isMouse).toBe(false)
  })

  it('should clamp position within max radius', async () => {
    const wrapper = mount(Joystick, {
      attachTo: document.body,
    })
    const vm = wrapper.vm as any

    // 模拟 DOM 尺寸
    Object.defineProperty(vm.$refs.outsideRef, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 200, height: 200 }),
    })
    Object.defineProperty(vm.$refs.innsideRef, 'getBoundingClientRect', {
      value: () => ({ width: 50, height: 50 }),
    })

    await vm.updateCenter()
    vm.calcInnsidePosition(300, 0) // 模拟超出距离

    const distance = Math.sqrt(vm.position.x ** 2 + vm.position.y ** 2)
    expect(distance).toBeLessThanOrEqual(vm.radius)
  })
})
