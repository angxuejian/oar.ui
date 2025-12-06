# Collapse折叠面板

通过点击标题展开或收缩内容的面板。

## 基础用法

最基础的用法，通过 `title` 属性定义标题。

::: demo
<OarCollapse title="基础标题">
  <div>这是一段基础的内容文本。可以包含任意 HTML 元素。</div>
</OarCollapse>
:::

## 禁用状态

使用 `disabled` 属性来控制是否禁用折叠面板，禁用状态下无法展开或收起。

::: demo
<OarCollapse title="正常状态">
  <div>正常内容</div>
</OarCollapse>
<div style="margin-top: 10px;"></div>
<OarCollapse title="禁用状态 (未展开)" disabled>
  <div>这段内容不可见</div>
</OarCollapse>
<div style="margin-top: 10px;"></div>
<OarCollapse title="禁用状态 (已展开)" :expand="true" disabled>
  <div>这段内容虽然可见，但无法收起</div>
</OarCollapse>
:::

## 最大高度

通过 `max-height` 属性限制内容区域的最大高度。当内容超出该高度时，将出现滚动条。

::: demo
<OarCollapse title="限制高度的内容" :max-height="100">
  <p>第一行内容...</p>
  <p>第二行内容...</p>
  <p>第三行内容...</p>
  <p>第四行内容...</p>
  <p>第五行内容...</p>
  <p>第六行内容...</p>
</OarCollapse>
:::

## 自定义标题与图标

提供了 `title` 和 `icon` 插槽，用于自定义宽度、头部内容和右侧图标。

::: demo
<OarCollapse style='width: 200px;'>
  <template #title>
    <span style="font-weight: bold; color: yellow;">自定义 Title 插槽</span>
  </template>
  <template #icon="{ expand }">
    <span>{{ expand ? '➖' : '➕' }}</span>
  </template>
  <div>
    自定义了标题样式和展开/收起图标。
  </div>
</OarCollapse>
:::

## CollapseGroup 手风琴
默认情况下，`CollapseGroup` 开启手风琴模式 (`accordion="true"`)，这意味着每次只能展开一个面板。
此时，需要通过 `v-model:select` 绑定当前展开面板的 `name`。

::: demo
<script setup>
    import { ref } from 'vue'
    const activeName = ref('1')
</script>

<template>
    <div style="margin-bottom: 10px;">当前展开的面板 Name: {{ activeName }}</div>
    <OarCollapseGroup v-model:select="activeName">
        <OarCollapse name="1" title="一致性 Consistency">
            <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念。</div>
        </OarCollapse>
        <OarCollapse name="2" title="反馈 Feedback">
            <div>控制反馈：通过界面样式和交互动效让用户感知自己的操作。</div>
        </OarCollapse>
        <OarCollapse name="3" title="效率 Efficiency">
            <div>简化流程：设计简洁直观的操作流程。</div>
        </OarCollapse>
    </OarCollapseGroup>
</template>
:::

##  CollapseGroup 非手风琴

通过设置 `accordion` 属性为 `false`，可以允许同时展开多个面板。

> 注意：在非手风琴模式下，`name` 属性依然是必须的，用于内部区分不同的面板状态。

::: demo
<OarCollapseGroup :accordion="false">
    <OarCollapse name="guide" title="设计指南">
        <div>设计指南的内容...</div>
    </OarCollapse>
    <OarCollapse name="component" title="组件交互">
        <div>组件交互的内容...</div>
    </OarCollapse>
    <OarCollapse name="resource" title="资源列表">
        <div>资源列表的内容...</div>
    </OarCollapse>
</OarCollapseGroup>
:::

## CollapseGroup 整组禁用

在 `CollapseGroup` 上设置 `disabled` 属性，可以禁用组内所有的折叠面板。

::: demo
<OarCollapseGroup disabled select="1">
    <OarCollapse name="1" title="已展开但禁用">
        <div>因为父级组件被禁用，这里无法收起。</div>
    </OarCollapse>
    <OarCollapse name="2" title="未展开且禁用">
        <div>因为父级组件被禁用，这里无法点击展开。</div>
    </OarCollapse>
</OarCollapseGroup>
:::

## Collapse Attributes

| 属性名     | 说明               | 类型            | 默认值 |
| ---------- | ------------------ | --------------- | ------ |
| name       | 组件处于 collapseGroup 中时，用作当前项的选中标识 | string | '' |
| title      | 面板标题           | string          | ''  |
| expand     | 是否展开 (v-model) | boolean         | false  |
| disabled   | 是否为禁用状态     | boolean         | false  |
| max-height | 内容区域的最大高度 | number / string | -      |

## Collapse Slots

| 插槽名 | 说明           | Solot Props         |
| ------ | -------------- | ------------------ |
| default| 面板的主体内容 | -                  |
| title  | 自定义标题内容 | -                  |
| icon   | 自定义右侧图标 | `{ expand: boolean }` |

## Collapse Events

| 事件名 | 说明           | 回调参数        |
| ------ | -------------- | --------------- |
| change | 切换状态时触发 | `(value: boolean)` |

## CollapseGroup Attributes

|属性名	|说明	|类型	|默认值|
| ----- | ----- | ----- | ------|
|select	|当前激活的面板的 |name (v-model)	|string	|''|
|accordion|	是否开启手风琴模式（每次只展开一个）|	boolean|	true|
|disabled	|是否禁用整个组	|boolean|	false|

## CollapseGroup Events

| 事件名 | 说明           | 回调参数        |
| ------ | -------------- | --------------- |
| change | 当前激活面板改变时触发 | `(value: string)` / `(value: { [key: string]: boolean })` |

## CollapseGroup  Slots

| 插槽名 | 说明           |
| ------ | -------------- | 
| default| 放置 Collapse 组件 |