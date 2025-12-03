# DashedLoading 虚线加载动画

用于展示加载中状态的圆形虚线动画组件。

## 基础用法

通过设置`radius`、`strokeWidth`、`padding`等属性定义加载动画的样式。

::: demo
<template>
    <OarDashedLoading />
    <OarDashedLoading style="margin-left: 50px;" :radius="14" />
    <OarDashedLoading style="margin-left: 50px;" :stroke-width="2" />
    <OarDashedLoading style="margin-left: 50px;" :padding="6" />
</template>
:::

## 虚线长度控制

使用 `dashedPercent` 控制虚线段长度占圆周长的百分比，取值 `0 ~ 1`。

::: demo
<OarDashedLoading :dashed-percent="0.3" />
<OarDashedLoading style="margin-left: 16px;" :dashed-percent="0.5" />
<OarDashedLoading style="margin-left: 16px;" :dashed-percent="0.8" />
:::

## 尺寸自适应

组件会根据 `radius`、`strokeWidth` 和 `padding` 自动计算最终 SVG 尺寸，无需手动指定宽高。

::: demo
<OarDashedLoading :radius="8" />
<OarDashedLoading style="margin-left: 16px;" :radius="12" />
<OarDashedLoading style="margin-left: 16px;" :radius="20" />
:::

## 动画效果

组件内置三种动画逻辑：

- **rotate**：整体旋转
- **flowing**：虚线沿圆周流动
- **breathing**：虚线段长度呼吸变化

无需任何额外配置，即可自动执行。

::: demo
<DashedLoading />
:::


## DashedLoading Attributes

| 属性名         | 说明              | 类型     | 默认值  |
| ----------- | --------------- | ------ | ---- |
| radius      | 圆半径             | number | 10   |
| strokeWidth | 线条宽度            | number | 1    |
| padding     | 内部留白，用于避免裁切     | number | 4    |
| dashedPercent    | 虚线段占圆周比例（0 - 1） | number | 0.75 |




