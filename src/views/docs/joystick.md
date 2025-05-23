# Joystick 摇杆

方向操作摇杆

## 基础用法

支持```mouse```、```touch```、 ```keyboard```操作，并支持8个方向。因监听的都是一个```keyboard```事件，页面上同时存在多个组件时，会同时触发```keyboard```事件
::: demo
<OarJoystick />
::: 

## Change 事件
查看控制台

::: demo
<template>
    <OarJoystick @change='changeHandler' />
</template>

<script setup lang='ts'>
const changeHandler = (event: JoystickChangeDataType) => {
    console.log(event)
}
</script>
:::

## Joystick Attributes

属性名 | 说明 | 类型 | 默认值
---   | --- | --- | ---
width| 宽度 | number | 180(px)
height | 高度 | number | 180(px)

## Input Events

事件名 | 说明 | 类型
--- | --- |---
change | 操作时返回的方向、角度、弧度、力度等信息 | Function
