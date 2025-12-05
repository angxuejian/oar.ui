# AutoCloseRing 自动关闭环

用于显示倒计时关闭的圆形按钮组件，带圆形进度动画与关闭图标。

## 基础用法

组件会在挂载后自动开始倒计时，倒计时结束会触发 close 事件。

::: demo
<OarAutoCloseRing />
:::

## 自定义样式
可以通过设置 `size`、`strokeWidth`、`rotate` 等参数调整样式表现。

::: demo
<OarAutoCloseRing :size="50" />
<OarAutoCloseRing style="margin-left: 12px;" :stroke-width="2" />
<OarAutoCloseRing style="margin-left: 12px;" :rotate="0" />
:::

## 倒计时方向

通过 `reverse` 控制计时方向

::: demo
<OarAutoCloseRing :reverse="false" />
<OarAutoCloseRing style="margin-left: 12px;" />
:::

## 关闭比例（X 图标大小）

通过设置 `closeRatio` 调整叉号大小，范围 [0 ~ 1]。

::: demo
<OarAutoCloseRing :closeRatio="0.4" />
<OarAutoCloseRing style="margin-left: 12px;" :closeRatio="0.8" />
:::

## 触发关闭事件

点击组件或倒计时结束时会触发 `close` 事件。详看控制台

::: demo
<template>
    <OarAutoCloseRing @close="handleClose" />
</template>

<script lang="ts" setup>

const handleClose = () => {
    console.log('Closed!')
}
</script>
:::

## AutoCloseRing Attributes

| 属性名         | 说明           | 类型      | 默认值  |
| ----------- | ------------ | ------- | ---- |
| size        | 组件尺寸（像素）     | number  | 20   |
| strokeWidth | 进度环线宽        | number  | 1    |
| duration    | 倒计时总时长（毫秒）   | number  | 5000 |
| rotate      | 整体旋转角度（deg）  | number  | -90  |
| reverse     | 是否反向（从满到空）计时 | boolean | true |
| closeRatio  | X 大小比例（0~1）  | number  | 0.6  |

## AutoCloseRing Events

| 事件名   | 说明           | 回调参数 |
| ----- | ------------ | ---- |
| close | 倒计时结束或点击触发关闭 | —    |
