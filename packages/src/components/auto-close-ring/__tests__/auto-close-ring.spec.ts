// AutoCloseRing.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import AutoCloseRing from '../src/index.vue'
import { nextTick } from 'vue'

// 全局 mock requestAnimationFrame
beforeEach(() => {
  vi.useFakeTimers()

  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    return setTimeout(() => cb(performance.now()), 16)
  })

  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    clearTimeout(id)
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('AutoCloseRing.vue', () => {
  it('should render svg root with correct namespace and classes', () => {
    const wrapper = mount(AutoCloseRing)

    const svg = wrapper.find('svg')

    expect(svg.exists()).toBe(true)
    expect(svg.attributes('role')).toBe('button')
    expect(svg.classes()).toContain('oar-auto-close-ring')
  })

  it('should apply correct svg width/height via style', () => {
    const wrapper = mount(AutoCloseRing, {
      props: { size: 30 },
    })

    const svg = wrapper.find('svg')

    expect(svg.attributes('style')).toContain('width: 30px;')
    expect(svg.attributes('style')).toContain('height: 30px;')
  })

  it('should compute correct viewBox', () => {
    const wrapper = mount(AutoCloseRing, {
      props: { size: 40 },
    })

    const svg = wrapper.find('svg')
    expect(svg.attributes('viewBox')).toBe('0 0 40 40')
  })

  it('should compute radius correctly', () => {
    const wrapper = mount(AutoCloseRing, {
      props: { size: 20, strokeWidth: 2 },
    })

    const vm: any = wrapper.vm

    expect(vm.radius).toBe(9) // center=10, radius=10 - (2/2)
  })

  it('should compute cross line positions correctly', () => {
    const wrapper = mount(AutoCloseRing, {
      props: { size: 20, strokeWidth: 2, closeRatio: 1 },
    })

    const vm: any = wrapper.vm

    const expected = 8 / Math.sqrt(2)
    expect(vm.innerRadius).toBeCloseTo(expected)
    expect(vm.x1).toBeCloseTo(10 - expected)
    expect(vm.x2).toBeCloseTo(10 + expected)
  })

  it('should render progress circle elements', () => {
    const wrapper = mount(AutoCloseRing)

    const bg = wrapper.find('.oar-auto-close-ring__progress-bg')
    const progress = wrapper.find('.oar-auto-close-ring__progress')

    expect(bg.exists()).toBe(true)
    expect(progress.exists()).toBe(true)
  })

  it('should render two close lines', () => {
    const wrapper = mount(AutoCloseRing)

    const lines = wrapper.findAll('.oar-auto-close-ring__close')
    expect(lines.length).toBe(2)
  })

  it('should emit close event after countdown finishes (reverse mode)', async () => {
    let now = 0
    vi.spyOn(performance, 'now').mockImplementation(() => now)

    const wrapper = mount(AutoCloseRing, {
      props: {
        duration: 1000,
        reverse: true,
      },
    })

    await nextTick()

    now += 1200
    vi.advanceTimersByTime(1200)

    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')!.length).toBe(1)
  })

  it('should restart countdown when watched props change', async () => {
    const wrapper = mount(AutoCloseRing, { props: { reverse: true } })

    expect((wrapper.vm as any).progress).toBeGreaterThan(0.9)

    await wrapper.setProps({ duration: 999 })

    expect((wrapper.vm as any).progress).toBeGreaterThan(0.9)
  })

  it('should cancel animation on unmount', () => {
    const wrapper = mount(AutoCloseRing)
    const spy = vi.spyOn(window, 'cancelAnimationFrame')

    wrapper.unmount()

    expect(spy).toHaveBeenCalled()
  })

  it('should emit close when svg clicked', async () => {
    const wrapper = mount(AutoCloseRing)

    await wrapper.find('svg').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should compute dashoffset correctly based on progress', async () => {
    const wrapper = mount(AutoCloseRing, { props: { reverse: false } })
    const vm: any = wrapper.vm

    vm.progress = 0.5
    await wrapper.vm.$nextTick()

    expect(vm.dashoffset).toBeCloseTo(vm.circumference * 0.5)
  })
})
