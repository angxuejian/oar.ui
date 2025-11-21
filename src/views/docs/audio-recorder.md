# AudioRecorder 音频录制器

用于录制音频，并输出 Blob 或 PCM16 ArrayBuffer 数据。


## 用法

通过点击触发元素开始录音，松开后自动结束并返回录音数据。

::: demo
<OarAudioRecorder>
  <template #trigger>
    <OarButton>按住说话</OarButton>
  </template>
</OarAudioRecorder>
:::


## PCM16 输出

设置 `pcm16` 属性为 `true` 即可让组件输出 **PCM16 原始数据（ArrayBuffer）**。

::: demo
<OarAudioRecorder pcm16>
  <template #trigger>
    <OarButton plain>PCM16 输出</OarButton>
  </template>
</OarAudioRecorder>
:::

## 长按触发

设置 `pressDelay` 属性可控制多长时间判定为开始录音（毫秒）。

::: demo
<OarAudioRecorder :pressDelay="300">
  <template #trigger>
    <OarButton text>长按 300ms 开始录音</OarButton>
  </template>
</OarAudioRecorder>
:::

## Change

通过 @change 回调获取 `PCM16` 格式的音频数据 或 `Blob` 格式的音频文件。

::: demo
<template>
  <OarAudioRecorder @change="onCallbackChange" pcm16>
    <template #trigger>
        <OarButton plain>按住说话 - 并输出PCM16数据</OarButton>
    </template>
  </OarAudioRecorder>
</template>


<script lang='ts' setup>
const onCallbackChange = (data: Blob | ArrayBuffer) => {
  if (data instanceof ArrayBuffer) {
    console.log(data);
  }
}
</script>
:::

## 使用 Slot Props

通过在 `trigger` 插槽中接收组件提供的 `isPressing` 与 `isRecording` 状态参数，你可以根据录音阶段动态更新触发内容的展示形式，例如切换按钮文案、样式或提示信息。

::: demo
<OarAudioRecorder>
  <template #trigger="{ isPressing, isRecording }">
    <OarButton :plain="!isRecording">
      {{ isRecording ? '录音中...' : isPressing ? '准备录音' : '按住说话' }}
    </OarButton>
  </template>
</OarAudioRecorder>
:::


## AudioRecorder Attributes

| 属性名        | 说明                         | 类型      | 默认值   |
| ---------- | -------------------------- | ------- | ----- |
| pcm16      | 是否输出 PCM16 格式（ArrayBuffer） | boolean | false |
| pressDelay | 长按触发录音的判定时间（毫秒）            | number  | 150   |

## AudioRecorder Emits

| 事件名    | 说明          | 回调参数                   |
| ------ | ----------- | ---------------------- |
| change | 录音完成并返回音频数据 | `Blob` 或 `ArrayBuffer` |
| error  | 录音过程发生错误    | `string`               |
| cancel | 录音被用户取消     | —                      |

## AudioRecorder Slots

| 插槽名     | 说明         | Slot Props                                                  |
| ------- | ---------- | ----------------------------------------------------------- |
| trigger | 自定义触发录音的内容 | `isPressing: boolean` 是否处于按压中；`isRecording: boolean` 是否正在录音 |

