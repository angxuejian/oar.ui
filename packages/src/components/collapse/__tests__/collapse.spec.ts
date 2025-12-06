// Collapse.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Collapse from '../src/item.vue' // Adjust path as necessary

describe('Collapse.vue', () => {
  it('should render correct default structure', () => {
    const wrapper = mount(Collapse)

    // Check root class
    expect(wrapper.classes()).toContain('oar-collapse')
    // Check default title
    expect(wrapper.find('.oar-collapse__title').text()).toBe('')
    // Should not be expanded by default
    expect(wrapper.classes()).not.toContain('is-expand')
  })

  it('should render title from prop', () => {
    const title = 'My Custom Title'
    const wrapper = mount(Collapse, {
      props: {
        title,
      },
    })

    expect(wrapper.find('.oar-collapse__title').text()).toBe(title)
  })

  it('should render title from slot', () => {
    const wrapper = mount(Collapse, {
      slots: {
        title: '<span class="custom-title">Slot Title</span>',
      },
    })

    expect(wrapper.find('.custom-title').exists()).toBe(true)
    expect(wrapper.find('.oar-collapse__title').text()).toBe('Slot Title')
  })

  it('should render content from default slot', () => {
    const content = 'Hidden Content'
    const wrapper = mount(Collapse, {
      slots: {
        default: content,
      },
    })

    expect(wrapper.find('.oar-collapse__content').text()).toBe(content)
  })

  it('should toggle expand state when header is clicked', async () => {
    const wrapper = mount(Collapse, {
      props: {
        expand: false, // Initial state
        'onChange': vi.fn()
      },
    })

    const header = wrapper.find('.oar-collapse__header')

    // Click to expand
    await header.trigger('click')

    // 检查是否发出了 update:expand 事件，且值为 true
    expect(wrapper.emitted('update:expand')![0]).toEqual([true])
    expect(wrapper.emitted('change')![0]).toEqual([true])

    // Click to collapse
    await header.trigger('click')
    expect(wrapper.classes()).not.toContain('is-expand')
    expect(wrapper.emitted('change')![1]).toEqual([false])
  })

  it('should initialize in expanded state if expand prop is true', () => {
    const wrapper = mount(Collapse, {
      props: {
        expand: true,
      },
    })

    expect(wrapper.classes()).toContain('is-expand')
    // Check accessibility attribute
    expect(wrapper.attributes('aria-expanded')).toBe('true')
  })

  it('should apply disabled style and behavior', async () => {
    const wrapper = mount(Collapse, {
      props: {
        disabled: true,
      },
    })

    // Check disabled class
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('tabindex')).toBe('-1')

    // Click header
    await wrapper.find('.oar-collapse__header').trigger('click')

    // Should NOT emit events
    expect(wrapper.emitted('update:expand')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()
    // Should NOT have expand class
    expect(wrapper.classes()).not.toContain('is-expand')
  })

  it('should apply maxHeight style correctly', () => {
    // Case 1: Number (pixels)
    const wrapperNum = mount(Collapse, {
      props: {
        maxHeight: 200,
      },
    })
    const contentNum = wrapperNum.find('.oar-collapse__content')
    expect(contentNum.attributes('style')).toContain('max-height: 200px')
    expect(contentNum.attributes('style')).toContain('overflow-y: auto')

    // Case 2: String (percentage or other unit)
    const wrapperStr = mount(Collapse, {
      props: {
        maxHeight: '50%',
      },
    })
    const contentStr = wrapperStr.find('.oar-collapse__content')
    expect(contentStr.attributes('style')).toContain('max-height: 50%')
  })

  it('should customize the icon via slot', () => {
    const wrapper = mount(Collapse, {
      slots: {
        icon: '<div class="custom-icon">Icon</div>',
      },
    })

    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    // Default chevron should likely not be present if replaced (depending on implementation specifics, usually slots replace default content)
    // In your code: <slot name="icon"><ChevronDown /></slot>
    // So ChevronDown is not rendered if slot is provided
    expect(wrapper.findComponent({ name: 'ChevronDown' }).exists()).toBe(false)
  })

  it('should expose expand state to icon slot', () => {
    const wrapper = mount(Collapse, {
      props: {
        expand: true
      },
      slots: {
        icon: `
          <template #icon="{ expand }">
            <span class="icon-state">{{ expand ? 'Open' : 'Closed' }}</span>
          </template>
        `
      }
    })

    expect(wrapper.find('.icon-state').text()).toBe('Open')
  })
})
