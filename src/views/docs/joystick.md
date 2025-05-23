# Joystick 摇杆

方向操作摇杆，支持```touch```、```mouse```、```keyboard```事件控制

> 由于键盘事件监听的都是同一个，所以使用键盘控制时，所有组件都会触发keyboard事件。

## 基础用法

支持```mouse```、```touch```、 ```keyboard```操作，并支持8个方向。因监听的都是一个```keyboard```事件，页面上同时存在多个组件时，会同时触发```keyboard```事件
::: demo
<OarJoystick />
::: 

## Rotate
摇杆旋转，支持```arrowleft```、```arrowright```、```,```、```.```、```4```、```6```键盘按钮来控制摇杆
::: demo
<OarJoystick type='rotate' />
:::

## 8-way

摇杆获取8个方向的数值，请查看控制台

::: demo
<template>
    <OarJoystick type='linear' direction='8-way' @change='changeHandler' />
</template>

<script setup lang='ts'>
const changeHandler = (event: JoystickChangeLinear8WayDataType) => {
    console.log(event)
}
</script>
:::

## Linear Speed
使用键盘时，可以设置前进速度，来控制摇杆每次前进的步速

::: demo
<OarJoystick :linear-speed='0.5' />
::: 


## Joystick Attributes

属性名 | 说明 | 类型 | 默认值
---   | --- | --- | ---
type | 摇杆是前进还是旋转 | 'linear'、'rotate' | 'linear'
direction | type === 'linear'时可以获得的方向，4个方向 or 8个方向 | '4-way' 、 '8-way' | '4-way'
width| 宽度 | number | 180(px)
height | 高度 | number | 180(px)
linearSpeed | 键盘控制摇杆前进时每次增加的速度 | number | 2
rotateSpeed | 键盘控制摇杆旋转时每次增加的弧度 | number | 0.012(radian)

## Input Events

事件名 | 说明 | 类型
--- | --- |---
change | 操作时返回的方向、角度、弧度、力度等信息 | Function
