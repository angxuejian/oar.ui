// Input.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Input from '../src/index.vue' // Adjust to the correct path

describe('Input.vue', () => {
  it('should apply correct default class', () => {
    const wrapper = mount(Input)

    expect(wrapper.classes()).toContain('oar-input')
  })

  it('should apply focus class when focused', async () => {
    const wrapper = mount(Input)
    const inputElement = wrapper.find('input')

    await inputElement.trigger('focus')
    expect(wrapper.classes()).toContain('is-focus')
  })

  it('should apply disabled class when disabled prop is true', () => {
    const wrapper = mount(Input, {
      props: {
        disabled: true,
      },
    })

    expect(wrapper.classes()).toContain('is-disabled')
  })

  it('should not be disabled when disabled prop is false', () => {
    const wrapper = mount(Input, {
      props: {
        disabled: false,
      },
    })

    const inputElement = wrapper.find('input')
    expect(inputElement.attributes('disabled')).toBeUndefined()
  })

  it('should update input value when v-model changes', async () => {
    const wrapper = mount(Input)
    const inputElement = wrapper.find('input')

    await wrapper.setProps({ modelValue: 'Test value' })
    expect(inputElement.element.value).toBe('Test value')
  })

  it('should emit input event on typing', async () => {
    const wrapper = mount(Input)
    const inputElement = wrapper.find('input')

    await inputElement.setValue('New input')
    expect(wrapper.emitted()).toHaveProperty('input')
  })

  it('should show clear icon when clearable is true and input has value', async () => {
    const wrapper = mount(Input, {
      props: {
        clearable: true,
      },
    })

    const inputElement = wrapper.find('input')
    await inputElement.setValue('Text')

    const clearIcon = wrapper.find('.oar-input__clear')
    expect(clearIcon.exists()).toBe(true)
  })

  it('should clear input when clear icon is clicked', async () => {
    const wrapper = mount(Input, {
      props: {
        clearable: true,
      },
    })

    const inputElement = wrapper.find('input')
    await inputElement.setValue('Text')

    await inputElement.trigger('focus')
    const clearIcon = wrapper.find('.oar-input__clear')
    await clearIcon.trigger('click')

    expect(inputElement.element.value).toBe('')
    expect(wrapper.emitted()).toHaveProperty('clear')
  })

  it('should toggle password visibility when eye icon is clicked', async () => {
    const wrapper = mount(Input, {
      props: {
        type: 'password',
      },
    })
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('password') // 默认是密码

    const eyeIcon = wrapper.find('.oar-input__eye')
    await eyeIcon.trigger('click')

    expect(input.attributes('type')).toBe('text')

    await eyeIcon.trigger('click')
    expect(input.attributes('type')).toBe('password')
  })

  it('should apply correct maxlength value', async () => {
    const wrapper = mount(Input, {
      props: {
        maxlength: 10,
      },
    })

    const inputElement = wrapper.find('input')
    expect(inputElement.attributes('maxlength')).toBe('10')
  })

  it('should apply readonly attribute when readonly prop is true', () => {
    const wrapper = mount(Input, {
      props: {
        readonly: true,
      },
    })

    const inputElement = wrapper.find('input')
    expect(inputElement.attributes('readonly')).toBeDefined()
  })

  it('should apply placeholder when placeholder prop is provided', () => {
    const wrapper = mount(Input, {
      props: {
        placeholder: 'Enter text',
      },
    })

    const inputElement = wrapper.find('input')
    expect(inputElement.attributes('placeholder')).toBe('Enter text')
  })

  it('should not emit input event when input is disabled', async () => {
    const wrapper = mount(Input, {
      props: {
        disabled: true,
      },
    })

    const inputElement = wrapper.find('input')
    await inputElement.setValue('Disabled input')

    expect(wrapper.emitted()).not.toHaveProperty('input')
  })

  it('should render the length counter correctly', async () => {
    const wrapper = mount(Input, {
      props: {
        maxlength: 10,
      },
    })

    const inputElement = wrapper.find('input')
    await inputElement.setValue('Test')

    const lengthSpan = wrapper.find('.oar-input__length')
    expect(lengthSpan.text()).toBe('4 / 10')
  })

  it('should pass additional attributes to the input', () => {
    const wrapper = mount(Input, {
      attrs: {
        'aria-label': 'search input',
      },
    })

    const inputElement = wrapper.find('input')
    expect(inputElement.attributes('aria-label')).toBe('search input')
  })
})
