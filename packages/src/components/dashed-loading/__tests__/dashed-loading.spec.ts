import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import DashedLoading from '../src/index.vue' // 修改成你的实际路径

describe('DashedLoading.vue', () => {
  it('should render svg and circle correctly', () => {
    const wrapper = mount(DashedLoading)

    const svg = wrapper.find('svg')
    const circle = wrapper.find('circle')

    expect(svg.exists()).toBe(true)
    expect(circle.exists()).toBe(true)
  })

  it('should apply namespace class', () => {
    const wrapper = mount(DashedLoading)

    expect(wrapper.find('svg').classes()).toContain('oar-dashed-loading')
  })

  it('should compute correct default viewBox', () => {
    const wrapper = mount(DashedLoading)

    // 默认值: radius=10, strokeWidth=1, padding=4
    // outer = 10 + 1 + 4 = 15
    // viewBoxSize = 30
    const svg = wrapper.find('svg')

    expect(svg.attributes('viewBox')).toBe('0 0 30 30')
  })

  it('should compute correct center position', () => {
    const wrapper = mount(DashedLoading)

    const circle = wrapper.find('circle')

    // 默认 center = 15
    expect(circle.attributes('cx')).toBe('15')
    expect(circle.attributes('cy')).toBe('15')
  })

  it('should compute correct radius and strokeWidth', () => {
    const wrapper = mount(DashedLoading, {
      props: {
        radius: 20,
        strokeWidth: 3,
      },
    })

    const circle = wrapper.find('circle')
    expect(circle.attributes('r')).toBe('20')
    expect(circle.attributes('stroke-width')).toBe('3')
  })

  it('should clamp dashLong percent between 0 and 1', async () => {
    const wrapper = mount(DashedLoading, {
      props: {
        dashLong: 5, // 超过 1
      },
    })

    const vm = wrapper.vm as any
    expect(vm.percent).toBe(1)

    await wrapper.setProps({ dashLong: -3 }) // 小于 0
    expect(vm.percent).toBe(0)
  })

  it('should compute SVG style variables correctly', () => {
    const wrapper = mount(DashedLoading, {
      props: {
        radius: 10,
        strokeWidth: 2,
        padding: 5,
        dashLong: 0.5,
      },
    })

    const svg = wrapper.find('svg')

    const style = svg.attributes('style')


    expect(style).toMatch(/--circ:\s*\d+\.\d{2}px/)
    expect(style).toMatch(/--dash-long:\s*\d+\.\d{2}px/)
    expect(style).toMatch(/--dash-gap:\s*\d+\.\d{2}px/)
  })

  it('should update computed values when props change', async () => {
    const wrapper = mount(DashedLoading)

    const svg = wrapper.find('svg')

    // 初始 outer = 15 → size 30
    expect(svg.attributes('viewBox')).toBe('0 0 30 30')

    await wrapper.setProps({ radius: 20 })

    // outer = 20 + 1 + 4 = 25 → size 50
    expect(wrapper.find('svg').attributes('viewBox')).toBe('0 0 50 50')
  })

  it('should render correct circle stroke style', () => {
    const wrapper = mount(DashedLoading)

    const circle = wrapper.find('circle')

    expect(circle.classes()).toContain('oar-dashed-loading__circle')
  })
})
