# Mask 遮罩层

用于创建页面的遮罩层，可用于弹窗、抽屉等场景。

## 基础用法

通过 v-model:show 控制遮罩的显示。默认会锁定滚动，点击遮罩可关闭。不设置`to`时，需要将父元素设置`相对定位`

::: demo
<template>
<div>
<div style="width: 100px; height: 100px; position: relative; margin-bottom: 10px;">
<OarMask v-model:show="show">
<div style="color: #fff">Content</div>
</OarMask>
</div>
<OarButton @click="show = !show">{{ show ? 'Close' : 'Open' }} Mask</OarButton>
</div>
</template>

<script setup> 
import { ref } from 'vue'
 
const show = ref(false) 
</script>

:::

## Teleport 挂载位置

通过 `to` 属性设置挂载位置，支持 `body` 或任意 `HTMLElement`。

::: demo
<template>
<div>
<OarMask v-model:show="show" to='body'>
<div style="color: #fff">Mounted to body</div>
</OarMask>
<OarButton @click="show = !show">Open</OarButton>
</div>
</template>

<script setup> 
import { ref } from 'vue'
 
const show = ref(false) 
</script>

:::

## 点击遮罩关闭

设置 `closeOnClick` 控制点击空白区域是否关闭遮罩。

::: demo
<template>
<div>
<div style="width: 100px; height: 100px; position: relative; margin-bottom: 10px;">
<OarMask v-model:show="show" :closeOnClick="false">
<div style="color: #fff">Click mask won't close</div>
</OarMask>
</div>
<OarButton @click="show = !show">{{ show ? 'Close' : 'Open' }} Mask</OarButton>
</div>
</template>

<script setup> 
import { ref } from 'vue'
 
const show = ref(false) 
</script>

:::

## 设置透明度

设置 `opacity` 调整遮罩的透明度。

::: demo
<template>
<div>
<OarMask v-model:show="show" to='body' :opacity="0.2">
<div style="color: #fff">20% opacity</div>
</OarMask>
<OarButton @click="show = !show">Open</OarButton>
</div>
</template>

<script setup> 
import { ref } from 'vue'
 
const show = ref(false) 
</script>

:::

## Mask Attributes

| 属性名       | 说明                       | 类型                | 默认值 |
| ------------ | -------------------------- | ------------------- | ------ |
| show         | 是否显示遮罩（v-model）    | boolean             | false  |
| to           | Teleport 挂载位置          | string｜HTMLElement | —      |
| lockScroll   | 是否在显示时锁定 body 滚动 | boolean             | true   |
| closeOnClick | 是否点击遮罩关闭           | boolean             | true   |
| opacity      | 背景透明度（0-1）          | number              | 0.5    |

## Mask Events

| 事件名 | 说明           | 回调参数 |
| ------ | -------------- | -------- |
| close  | 遮罩关闭时触发 | —        |

## Mask Slots

| 插槽名  | 说明             |
| ------- | ---------------- |
| default | 遮罩内容区域插槽 |
