# Window 窗口

支持可拖动、可居中、可指定渲染容器的窗口组件。

## 基础用法

使用 v-model:show 控制窗口显示与隐藏。

::: demo

<template>
    <div style="display:flex; gap:10px"> 
        <OarButton @click="(s1 = true)">打开窗口</OarButton> 
        <OarWindow center v-model:show="s1" title="Basic Window" :width="300" :height="200">
            <div>内容</div>
        </OarWindow>
    </div>
</template>

<script setup lang='ts'> 
    import { ref } from 'vue';
    const s1 = ref(false) 
</script>

:::

## 默认位置

通过 defaultPosition 设置窗口初始位置，默认为 { x: 0, y: 0 }。

::: demo

<template>
    <div style="display:flex; gap:10px"> 
        <OarButton @click="(s2 = true)">打开窗口</OarButton>
        <OarWindow v-model:show="s2" title="Default Position" :width="300" :height="200" :defaultPosition="{ x: 50, y: 80 }">
            <div>设置位置：x:50, y: 80</div>
        </OarWindow>
    </div>

</template>

<script setup lang='ts'> 
import { ref } from 'vue';
const s2 = ref(false) 
</script>

:::

## 居中窗口

当 center = true 时，窗口会在容器中自动居中。

::: demo

<template>
    <div style="display:flex; gap:10px"> 
        <OarButton @click="(s3 = true)">居中窗口</OarButton> 
        <OarWindow center v-model:show="s3" title="Basic Window" :width="300" :height="200">
            <div>内容</div>
        </OarWindow>
    </div>
</template>

<script setup lang='ts'> 
    import { ref } from 'vue';
    const s3 = ref(false) 
</script>

:::

## 自定义内容

通过 contentClass 和 contentStyle 为内容区域设置样式。

::: demo
<template>
<div style="display:flex; gap:10px">
<OarButton @click="(s4 = true)">打开内容窗口</OarButton>
<OarWindow
            v-model:show="s4"
            title="Custom Content"
            :width="300"
            :height="200"
            contentStyle="padding: 10px; background:#f4f4f4">

                <div>这里是内容区域，你可以放任何组件。</div>
            </OarWindow>
    </div>

</template>

<script setup lang='ts'> 
    import { ref } from 'vue';
    const s4 = ref(false) 
 </script>

:::

## 拖拽窗口

窗口顶部标题栏支持鼠标与触摸拖拽。

::: demo

<template>
    <div style="display:flex; gap:10px"> 
        <OarButton @click="(s5 = true)">可拖拽窗口</OarButton> 
        <OarWindow
            v-model:show="s5"
            title="Draggable Window"
            :width="300"
            :height="200">
            
                <div>去试试拖拽</div>
            </OarWindow>
    </div>
  
</template>

<script setup lang='ts'> 
    import { ref } from 'vue';
    const s5 = ref(false) 
 </script>

:::

## 关闭事件

点击关闭按钮时触发 `close` 事件。

::: demo

<template>
    <div style="display:flex; gap:10px"> 
        <OarButton @click="(s6 = true)">打开窗口</OarButton> 
        <OarWindow
            v-model:show="s6"
            title="Close Event"
            center
            @close='handleClose'
            :width="300"
            :height="200">
            
                <div>关闭后，会有回调</div>
            </OarWindow>
    </div>
  
</template>

<script setup lang='ts'> 
    import { ref } from 'vue';
    const s6 = ref(false) 
    const handleClose = () => alert('窗口已关闭')
 </script>

:::

## Window Attributes

| 属性名          | 说明                 | 类型          | 默认值    |
| --------------- | -------------------- | ------------- | --------- |
| show (v-model)  | 是否显示窗口         | boolean       | false     |
| title           | 窗口标题             | string        | 'New Tab' |
| to              | Teleport 挂载位置    | string        | 'body'    |
| center          | 是否在容器中自动居中 | boolean       | false     |
| defaultPosition | 默认位置 `{ x, y }`  | PositionType  | {0,0}     |
| width           | 内容区域宽度         | number/string | 必填      |
| height          | 内容区域高度         | number/string | 必填      |
| contentStyle    | 内容区域行内样式     | string        | —         |
| contentClass    | 内容区域自定义 class | string        | —         |

## Window Slots

| 插槽名  | 说明         |
| ------- | ------------ |
| default | 内容区域插槽 |

## Window Events

| 事件名 | 说明               | 回调参数 |
| ------ | ------------------ | -------- |
| close  | 点击关闭按钮时触发 | —        |
