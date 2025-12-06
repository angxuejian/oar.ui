// CollapseGroup.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import CollapseGroup from '../src/group.vue' // 根据实际路径修改
import Collapse from '../src/item.vue'       // 根据实际路径修改
import { ref, nextTick } from 'vue'

// 为了方便测试 Slot 和 v-model，我们创建一个临时的包装组件
// 这样可以模拟真实的使用场景
const createWrapper = (template: string, setupState = {}) => {
  return {
    components: { CollapseGroup, Collapse },
    template,
    setup() {
      return { ...setupState }
    }
  }
}

describe('CollapseGroup.vue', () => {

  // 1. 基础渲染测试
  it('should render correct default structure', () => {
    const wrapper = mount(CollapseGroup)

    expect(wrapper.classes()).toContain('oar-collapse-group')
    // 默认不禁用
    expect(wrapper.classes()).not.toContain('is-disabled')
  })

  // 2. 手风琴模式 (Accordion) - 默认行为
  describe('Accordion Mode (Default)', () => {
    it('should only allow one item to be expanded at a time', async () => {
      const activeName = ref('1')
      const wrapper = mount(createWrapper(
        `
        <CollapseGroup v-model:select="activeName">
          <Collapse name="1" title="Item 1" />
          <Collapse name="2" title="Item 2" />
          <Collapse name="3" title="Item 3" />
        </CollapseGroup>
        `,
        { activeName }
      ))

      const items = wrapper.findAllComponents(Collapse)
      const headers = wrapper.findAll('.oar-collapse__header')

      // 初始状态：Item 1 展开
      expect(items[0].classes()).toContain('is-expand')
      expect(items[1].classes()).not.toContain('is-expand')

      // 点击 Item 2
      await headers[1].trigger('click')

      // 验证状态切换：Item 1 关闭，Item 2 展开
      expect(items[0].classes()).not.toContain('is-expand')
      expect(items[1].classes()).toContain('is-expand')

      // 验证 v-model 更新
      expect(activeName.value).toBe('2')

      // 再次点击 Item 2 (应该关闭)
      await headers[1].trigger('click')
      expect(items[1].classes()).not.toContain('is-expand')
      expect(activeName.value).toBe('')
    })
  })

  // 3. 多选模式 (accordion = false)
  describe('Multi-select Mode', () => {
    it('should allow multiple items to be expanded', async () => {
      const handleChange = vi.fn()
      const wrapper = mount(createWrapper(
        `
        <CollapseGroup :accordion="false" @change="handleChange">
          <Collapse name="A" title="Item A" />
          <Collapse name="B" title="Item B" />
        </CollapseGroup>
        `,
        { handleChange }
      ))

      const items = wrapper.findAllComponents(Collapse)
      const headers = wrapper.findAll('.oar-collapse__header')

      // 初始：全部关闭
      expect(items[0].classes()).not.toContain('is-expand')
      expect(items[1].classes()).not.toContain('is-expand')

      // 点击 A -> A 展开
      await headers[0].trigger('click')
      expect(items[0].classes()).toContain('is-expand')

      // 检查事件回调 (Group 源码逻辑：emits('change', toRaw(selectAll)))
      expect(handleChange).toHaveBeenCalled()
      // 期望参数类似于 { A: true }
      expect(handleChange.mock.calls[0][0]).toMatchObject({ A: true })

      // 点击 B -> A 保持展开，B 展开
      await headers[1].trigger('click')
      expect(items[0].classes()).toContain('is-expand')
      expect(items[1].classes()).toContain('is-expand')

      // 期望参数类似于 { A: true, B: true }
      expect(handleChange.mock.calls[1][0]).toMatchObject({ A: true, B: true })

      // 再次点击 A -> A 关闭，B 保持展开
      await headers[0].trigger('click')
      expect(items[0].classes()).not.toContain('is-expand')
      expect(items[1].classes()).toContain('is-expand')
      expect(handleChange.mock.calls[2][0]).toMatchObject({ A: false, B: true })
    })
  })

  // 4. 禁用状态 (Disabled Group)
  describe('Disabled State', () => {
    it('should disable all items when group is disabled', async () => {
      const activeName = ref('')
      const wrapper = mount(createWrapper(
        `
        <CollapseGroup disabled v-model:select="activeName">
          <Collapse name="1" title="Item 1" />
          <Collapse name="2" title="Item 2" />
        </CollapseGroup>
        `,
        { activeName }
      ))

      // 检查 Group 样式
      expect(wrapper.find('.oar-collapse-group').classes()).toContain('is-disabled')

      // 尝试点击
      const headers = wrapper.findAll('.oar-collapse__header')
      await headers[0].trigger('click')

      // 状态不应改变
      expect(activeName.value).toBe('')
      expect(wrapper.findAll('.is-expand').length).toBe(0)
    })
  })

  // 5. 动态响应测试
  describe('Reactivity', () => {
    it('should update expanded item when v-model changes programmatically', async () => {
      const activeName = ref('1')
      const wrapper = mount(createWrapper(
        `
        <CollapseGroup v-model:select="activeName">
          <Collapse name="1" />
          <Collapse name="2" />
        </CollapseGroup>
        `,
        { activeName }
      ))

      const items = wrapper.findAllComponents(Collapse)

      // 初始 '1'
      expect(items[0].classes()).toContain('is-expand')

      // 外部修改 model 为 '2'
      activeName.value = '2'
      await nextTick() // 等待 Vue 响应式更新

      expect(items[0].classes()).not.toContain('is-expand')
      expect(items[1].classes()).toContain('is-expand')
    })
  })

  // 6. 嵌套样式逻辑 (CSS 边界检查)
  // 源码中有针对 first-child / last-child 的圆角处理逻辑，虽然这是 CSS 行为，
  // 但我们可以检查 DOM 结构是否正确嵌套，以确保 CSS 选择器能生效
  it('should render children correctly for CSS selectors', () => {
    const wrapper = mount(CollapseGroup, {
      slots: {
        default: [
          '<div class="mock-item">Item 1</div>',
          '<div class="mock-item">Item 2</div>'
        ]
      }
    })

    // 确认插槽内容直接渲染在 .oar-collapse-group 下
    expect(wrapper.find('.oar-collapse-group').html()).toContain('Item 1')
  })
})
