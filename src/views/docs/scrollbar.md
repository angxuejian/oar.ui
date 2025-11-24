# Scrollbar 滚动条

用于替换浏览器原生滚动条

## 默认样式

浏览器默认滚动条样式

::: demo
<template>
<OarScrollbar default style='height: 200px; background-color: #f5f5f5;'>

<div v-for='(item, index) in 20'>{{ item }}</div>
</OarScrollbar>
</template>
:::

## 基础用法

设置`Style`、`Class`即可，需要设置高度或宽度，显示X轴或Y轴滚动条是根据`solt`内容来自行决定

:::demo
<OarScrollbar style='height: 200px; background-color: #f5f5f5;'>

<div v-for='(item, index) in 20'>{{ item }}</div>
</OarScrollbar>
:::

## 纵向滚动

设置`scroll-y`，只显示Y轴滚动条

::: demo
<OarScrollbar scroll-y style='height: 200px; background-color: #f5f5f5;'>

<div v-for='(item, index) in 20'>{{ item }}</div>
</OarScrollbar>
:::

## 横向滚动

设置`scroll-x`，只显示X轴滚动条

::: demo
<OarScrollbar scroll-x style='background-color: #f5f5f5;'>

<div style='display: inline-flex; white-space: nowrap;'>
<div style='width: 100px;height: 50px; line-height: 50px; text-align: center;' v-for='(item, index) in 20'>{{ item }}</div>
</div>
</OarScrollbar>
:::

## 常驻显示滚动条

设置`always`，使其滚动条常驻

::: demo
<OarScrollbar always style='height: 200px; background-color: #f5f5f5;'>

<div v-for='(item, index) in 20'>{{ item }}</div>
</OarScrollbar>
:::

## Scrollbar Attributes

| 属性名   | 说明                   | 类型    | 默认值 |
| -------- | ---------------------- | ------- | ------ |
| default  | 是否显示浏览器默认样式 | boolean | false  |
| always   | 是否常驻滚动条         | boolean | false  |
| scroll-x | 只显示x轴滚动条        | boolean | false  |
| scroll-y | 只显示y轴滚动条        | boolean | false  |

## Scrollbar Events

| 事件名 | 说明           | 类型     |
| ------ | -------------- | -------- |
| scroll | 滚动条滚动事件 | Function |

## Scrollbar Exposes

| 名称          | 说明                  | 类型     |
| ------------- | --------------------- | -------- |
| ref           | 滚动条包裹的 ref 对象 | Vue Ref  |
| setScrollTop  | 设置滚动条Y轴位置     | Function |
| setScrollLeft | 设置滚动条X轴位置     | Function |
