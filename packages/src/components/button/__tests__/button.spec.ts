// Button.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Button from '../src/index.vue' // Adjust to the correct path

describe('Button.vue', () => {
  it('should apply correct default class', () => {
    const wrapper = mount(Button)

    // Check default class
    expect(wrapper.classes()).toContain('oar-button')
    expect(wrapper.classes()).toContain('oar-button--primary')
  })


  it('should apply loading class when loading prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
    })

    // Check that the loading class is applied
    expect(wrapper.classes()).toContain('oar-button--loading')
  })


  it('should not be disabled if disabled prop is false', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: false,
      },
    })

    // Check button is not disabled
    const buttonElement = wrapper.find('button')
    expect(buttonElement.attributes('disabled')).toBeUndefined()
  })


  it('should be disabled when disabled prop is true', async () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
    })

    const buttonElement = wrapper.find('button')
    await wrapper.vm.$nextTick()

    // 检查vue props是否添加属性成功，因为是boolean值，属性存在即是true
    expect(buttonElement.attributes('disabled')).toBeDefined()

    // 检查vue渲染后的button标签是否将disabled设置成功
    expect(buttonElement.element.disabled).toBe(true)
  })


  it('should show loading spinner when loading prop is true and button is not disabled', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
        disabled: false,
      },
    })

    // Check loading spinner visibility
    const spinner = wrapper.find('.loading-circle')
    expect(spinner.exists()).toBe(true)
  })


  it('should apply plain style when plain prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        plain: true,
      },
    })

    // Check if plain class is added
    expect(wrapper.classes()).toContain('is-plain')
  })


  it('should apply text style when text prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        text: true,
      },
    })

    // Check if text class is added
    expect(wrapper.classes()).toContain('is-text')
  })


  it('should apply computed button classes correctly based on props', async () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary',
        loading: true,
        disabled: false,
        plain: true,
        text: false,
      },
    })

    // Check that the correct computed classes are applied
    expect(wrapper.classes()).toContain('oar-button--primary')
    expect(wrapper.classes()).toContain('oar-button--loading')
    expect(wrapper.classes()).toContain('is-plain')
    expect(wrapper.classes()).not.toContain('is-text')
  })


  it('should pass additional attributes to the button', () => {
    const wrapper = mount(Button, {
      attrs: {
        'aria-label': 'submit button',
      },
    })

    const buttonElement = wrapper.find('button')
    expect(buttonElement.attributes('aria-label')).toBe('submit button')
  })


  it('should not emit click event when disabled', async () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted()).not.toHaveProperty('click')
  })


  it('should render content inside the button', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click Me',
      },
    })

    const buttonContent = wrapper.text()
    expect(buttonContent).toContain('Click Me')
  })


  it('should apply plain style correctly when plain and text are true', async () => {
    const wrapper = mount(Button, {
      props: {
        text: true,
        plain: true,
      },
    })

    expect(wrapper.classes()).toContain('is-plain')
    expect(wrapper.classes()).not.toContain('is-text')
  })


  it('should update button class when loading prop changes', async () => {
    const wrapper = mount(Button)

    // 初始加载时不应该有 loading 样式
    expect(wrapper.classes()).not.toContain('oar-button--loading')

    // 修改 loading 为 true
    await wrapper.setProps({ loading: true })
    expect(wrapper.classes()).toContain('oar-button--loading')

    // 修改 loading 为 false
    await wrapper.setProps({ loading: false })
    expect(wrapper.classes()).not.toContain('oar-button--loading')
  })


  it('should emit a click event when clicked', async () => {
    const wrapper = mount(Button)

    await wrapper.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
