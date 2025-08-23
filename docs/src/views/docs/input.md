# Input输入框

通过键盘输入字符



## 默认样式

浏览器默认自带的样式，只对其width/height/color/font-size保持一致，其余均为浏览器自带样式

> clearable属性不会生效，maxlength属性不会显示输入字符

::: demo
<template>
    <OarInput default placeholder='Please input' v-model='input' />
</template>


<script setup lang='ts'>
    import { ref } from 'vue'
    const input = ref<string>('')
</script>
:::

## 基础用法

::: demo
<template>
    <OarInput placeholder='Please input' v-model='input' />
</template>


<script setup lang='ts'>
    import { ref } from 'vue'
    const input = ref<string>('')
</script>
:::

## 禁用状态
使用 disabled 属性来控制 input 组件是否为禁用状态

::: demo
<template>
    <OarInput placeholder='Please input' disabled v-model='input' />
</template>


<script setup lang='ts'>
    import { ref } from 'vue'
    const input = ref<string>('')
</script>
:::


## 只读状态
使用 readonly 属性来控制 input 组件是否为只读状态

::: demo
<template>
    <OarInput placeholder='Please input' readonly v-model='input' />
</template>


<script setup lang='ts'>
    import { ref } from 'vue'
    const input = ref<string>('')
</script>
:::

## 一键清空
使用 clearable 属性即可得到一个可一键清空的输入框

::: demo
<template>
    <OarInput clearable placeholder='Please input' v-model='input' />
</template>


<script setup lang='ts'>
    import { ref } from 'vue'
    const input = ref<string>('')
</script>
:::


## 密码框
使用 type="password" 即可得到一个可切换显示隐藏的密码框

::: demo
<template>
    <OarInput type='password' placeholder='password' v-model='input' />
</template>


<script setup lang='ts'>
    import { ref } from 'vue'
    const input = ref<string>('')
</script>
:::

## 输入长度限制
使用maxlength属性，来控制输入的最大字数

::: demo
<template>
    <OarInput clearable maxlength='50' v-model='input' />
</template>


<script setup lang='ts'>
    import { ref } from 'vue'
    const input = ref<string>('')
</script>
:::

## v-model 修饰符
使用v-model.lowercase修饰符，来保证输入的内容全部转为小写
::: demo
<template>
    <OarInput clearable v-model.lowercase='input' />
</template>


<script setup lang='ts'>
    import { ref } from 'vue'
    const input = ref<string>('')
</script>
:::

## Input Attributes

> 支持input全部原生属性

属性名 | 说明 | 类型 | 默认值
---   | --- | --- | ---
default| 是否显示浏览器默认样式 | boolean | false
v-model | 绑定值 | string | -
type | 显示文本框或密码框 | "text"、"password" | "text"
placeholder| 输入框占位文本 | string | -
disabled  | 是否为禁用状态 | boolean | false
readonly  | 是否为只读状态 | boolean | false
clearable | 是否显示清空按钮 | boolean | false
maxlength | 输入的最大字符 | number、string | -

## Input Events

> 支持input全部事件

事件名 | 说明 | 类型
--- | --- |---
focus | 当选择器的输入框获得焦点时触发 | Function
blur | 当选择器的输入框失去焦点时触发 | Function
input | 在 Input 值改变时触发 | Function
clear | 在点击由 clearable 属性生成的清空按钮时触发 | Function

## Input Exposes

名称 | 说明 | 类型
--- | --- | ---
ref | HTML元素 input  | Vue Ref
clear | 清除 input 值 | Function
focus | 使 input 获取焦点 | Function
blur | 使 input 失去焦点 | Function