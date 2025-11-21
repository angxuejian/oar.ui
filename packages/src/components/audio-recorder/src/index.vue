<template>
  <div :class="ns.b()">
    <div
      ref="triggerRef"
      :class="ns.e('trigger')"
      @mousedown="handlePressStart"
      @touchstart.prevent="handlePressStart"
      @touchend.prevent="handlePressEnd"
      @touchcancel.prevent="handlePressCancel"
    >
      <slot name="trigger" :is-pressing="isPressing" :is-recording="isRecording"></slot>
    </div>

    <teleport to="body">
      <Transition>
        <div v-if="isPressing" ref="popupRef" :class="ns.b('popup')" :style="popupStyle">
          <canvas ref="canvasRef"></canvas>
        </div>
      </Transition>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, type Ref, nextTick, onBeforeUnmount } from 'vue';
import { type UseCommonProps, useCommonComputed, useNamespace } from '@OarUI/hooks';

interface Props {
  pcm16?: boolean; // 是否输出 PCM16
  pressDelay?: number; // 长按判定（毫秒）
}

interface Emits {
  (e: 'change', data: Blob | ArrayBuffer): void;
  (e: 'error', error: string): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props & UseCommonProps>(), {
  pcm16: false,
  pressDelay: 200,
});
// const THEME_DEFAULT = useCommonComputed(props);
const emits = defineEmits<Emits>();
const ns = useNamespace('audio-recorder');

const triggerRef: Ref<HTMLElement | null> = ref(null);
const canvasRef: Ref<HTMLCanvasElement | null> = ref(null);
const popupRef: Ref<HTMLElement | null> = ref(null);

const isPressing = ref<boolean>(false);
const isRecording = ref<boolean>(false);

const popupPosition = reactive<{ left: number; top: number, opacity: number }>({ left: 0, top: 0, opacity: 0 });
const popupStyle = computed(() => {
  return {
    left: `${popupPosition.left}px`,
    top: `${popupPosition.top}px`,
    position: 'fixed' as const,
    opacity: popupPosition.opacity,
  };
});

// --- 录音相关 ---
let pressTimer: number | null = null;
let stream: MediaStream | null = null;
let mediaRecorder: MediaRecorder | null = null;
let animationId: number | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let source: MediaStreamAudioSourceNode | null = null;
let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let smoothBars: number[] = [];
let barRandoms: { maxMul: number; minMul: number }[] = [];
let bandOrder = [0, 1, 2]; // 初始顺序：低 → 中 → 高
let nextShuffleTime = 0;
let audioCtxRecorder: AudioContext | null = null;
let processor: ScriptProcessorNode | null = null;
let pcm16AudioChunks: Float32Array[] = [];
let audioCtxSource: MediaStreamAudioSourceNode | null = null;

onBeforeUnmount(() => {
  resetRecorderData();
});

const calcPopupPosition = async () => {
  await nextTick()

  if (!triggerRef.value || !popupRef.value) return

  const triggerRefrect = triggerRef.value.getBoundingClientRect();
  const popupRect = popupRef.value.getBoundingClientRect();

  // 13: 间距
  popupPosition.left = triggerRefrect.left - popupRect.width - 13;
  popupPosition.top = triggerRefrect.top - (popupRect.height - triggerRefrect.height) / 2;

  requestAnimationFrame(() => {
    popupPosition.opacity = 1
  })
}
// 按下
const handlePressStart = async (e: MouseEvent | TouchEvent) => {
  e.preventDefault();

  if (e instanceof MouseEvent) {
    window.addEventListener('mouseup', handlePressEnd, { passive: false });
    window.addEventListener('mouseleave', handlePressCancel, { passive: false });
  }

  if (pressTimer) window.clearTimeout(pressTimer);

  pressTimer = window.setTimeout(() => {
    popupPosition.opacity = 0;
    isPressing.value = true;
    // console.log('1. 开始录音');
    calcPopupPosition()
    startRecording();
  }, props.pressDelay);
};

// 抬起
const handlePressEnd = (e: MouseEvent | TouchEvent) => {
  e.preventDefault();
  resetRecorderData();
  // console.log('3. 结束录音');
};

// 意外取消
const handlePressCancel = () => {
  if (isPressing.value || isRecording.value) {
    resetRecorderData();
    // console.log('中断录音');
    emits('cancel');
  }
};

// 销毁event相关实例
const resetRecorderData = () => {
  if (pressTimer) {
    window.clearTimeout(pressTimer);
    pressTimer = null;
  }

  isPressing.value = false;

  window.removeEventListener('mouseup', handlePressEnd);
  window.removeEventListener('mouseleave', handlePressCancel);

  stopRecording();
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  stream = null;
};

// 开始录制音频
const startRecording = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    if (!isPressing.value) {
      stopRecording();
      return;
    }

    isRecording.value = true;
    startCanvasVisualization();

    if (!props.pcm16) {
      mediaRecorder = new MediaRecorder(stream);
      let audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/webm' });
        audioChunks = [];
        // console.log('4. 录制结束');
        emits('change', blob);
      };
      // console.log('2. 录制开始');
      mediaRecorder.start();
    } else {
      // 录制并change pcm16 音频

      audioCtxRecorder = new AudioContext({ sampleRate: 16000 }); // 16kHz 采样率
      audioCtxSource = audioCtxRecorder.createMediaStreamSource(stream);

      processor = audioCtxRecorder.createScriptProcessor(4096, 1, 1);
      audioCtxSource.connect(processor);
      processor.connect(audioCtxRecorder.destination);

      pcm16AudioChunks = [];

      processor.onaudioprocess = (e: AudioProcessingEvent) => {
        const input = e.inputBuffer.getChannelData(0);
        pcm16AudioChunks.push(new Float32Array(input));
      };
      // console.log('2. pcm16 录制开始');
    }
  } catch (error: any) {
    isRecording.value = false;
    resetRecorderData();
    emits('error', error);
  }
};

// 结束并销毁录制音频
const stopRecording = () => {
  isRecording.value = false;
  if (!props.pcm16) {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  } else {
    // 先清除回调，再断开连接
    if (processor) {
      processor.onaudioprocess = null;
      processor.disconnect();
      processor = null;
    }

    if (audioCtxSource) {
      audioCtxSource.disconnect();
      audioCtxSource = null;
    }

    if (audioCtxRecorder) {
      audioCtxRecorder.close();
      audioCtxRecorder = null;
    }

    if (pcm16AudioChunks.length) {
      const length = pcm16AudioChunks.reduce((acc, cur) => acc + cur.length, 0);
      const merged = new Float32Array(length);
      let offset = 0;
      for (const chunk of pcm16AudioChunks) {
        merged.set(chunk, offset);
        offset += chunk.length;
      }

      // 转成 PCM16
      const pcm16Buffer = floatTo16BitPCM(merged);
      emits('change', pcm16Buffer);
      pcm16AudioChunks = [];
      // console.log('4. pcm16 录制结束');
    }
  }

  stopCanvasVisualization();
  mediaRecorder = null;
};

// 准备绘制音频图
const startCanvasVisualization = async () => {

  if (!stream || !canvasRef.value) return;
  const canvas = canvasRef.value;
  ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvasRef.value.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  audioCtx = new AudioContext();
  source = audioCtx.createMediaStreamSource(stream);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256; // 性能优先

  source.connect(analyser);

  draw();
};

// 销毁音频图
const stopCanvasVisualization = () => {
  if (animationId) cancelAnimationFrame(animationId);
  animationId = null;

  if (source) {
    source.disconnect();
    source = null;
  }
  if (analyser) {
    analyser.disconnect();
    analyser = null;
  }

  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }

  if (ctx && canvasRef.value) {
    ctx.clearRect(0, 0, canvasRef.value.clientWidth, canvasRef.value.clientHeight);
    ctx = null;
  }

  barRandoms = [];
  smoothBars = [];
};

// 绘制音频图
const draw = () => {
  if (!ctx || !canvasRef.value || !analyser) return;

  animationId = requestAnimationFrame(draw);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  // --- 分 3 段 ---
  const third = Math.floor(bufferLength / 3);
  const low = dataArray.slice(0, third);
  const mid = dataArray.slice(third, third * 2);
  const high = dataArray.slice(third * 2);
  const bands = [low, mid, high];

  // --- 每隔 200~300ms 洗牌一次 ---
  const now = performance.now();
  if (now > nextShuffleTime) {
    bandOrder = [0, 1, 2];
    for (let i = bandOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bandOrder[i], bandOrder[j]] = [bandOrder[j], bandOrder[i]];
    }
    nextShuffleTime = now + 200 + Math.random() * 150;
  }

  // --- 按 bandOrder 拼接 ---
  const symmetricArray = Uint8Array.from([
    ...bands[bandOrder[0]],
    ...bands[bandOrder[1]],
    ...bands[bandOrder[2]],
  ]);

  // --- 是否无声 ---
  // const avg = symmetricArray.reduce((a, b) => a + b, 0) / bufferLength
  // if (avg > SILENCE_THRESHOLD) lastSoundTime = Date.now()
  // const isSilent = Date.now() - lastSoundTime > SILENCE_DURATION;

  const w = canvasRef.value.clientWidth;
  const h = canvasRef.value.clientHeight;
  ctx.clearRect(0, 0, w, h);

  const defaultBars = 20; // 默认音频柱子数量
  const barCount = Math.min(defaultBars, bufferLength);
  const itemBarWidth = w / barCount;
  const itemBarGapWidth = w / (barCount - 1);
  const step = Math.max(1, Math.ceil(bufferLength / barCount));

  if (smoothBars.length !== barCount) {
    smoothBars = new Array(barCount).fill(0);
  }

  if (barRandoms.length !== barCount) {
    barRandoms = Array.from({ length: barCount }, () => ({
      maxMul: randRange(0.45, 0.75),
      minMul: randRange(0.4, 0.65),
    }));
  }

  const barWidth = itemBarWidth * 0.7;
  const barGap = itemBarGapWidth * 0.3;
  const midCenter = Math.floor(h / 2); // 中心线
  const maxHeight = 45;
  const minHeight = 8;
  const easing = 0.18;

  for (let i = 0; i < barCount; i++) {
    // ---- 计算采样平均值 ----
    let sum = 0;
    let count = 0;
    for (let j = 0; j < step; j++) {
      const idx = i * step + j;
      if (idx >= symmetricArray.length) break;
      sum += symmetricArray[idx];
      count++;
    }

    const v = count > 0 ? sum / count : 0;
    const k = v / 255; // 归一化 0~1

    // ---- 每根柱子独立随机最大&最小高度 ----
    const { maxMul, minMul } = barRandoms[i];

    const barMax = maxHeight * maxMul;
    const barMin = minHeight * minMul;

    // ---- 把 k 映射到高度 ----
    let height = barMax * k;

    // 防止太小导致看不见：动态最小抖动
    if (height < barMin) height = barMin + Math.random() * 5;

    // ---- 平滑 ----
    smoothBars[i] += (height - smoothBars[i]) * easing;

    // ---- 绘制 ----
    const heightHalf = smoothBars[i] / 2;
    const x = i * (barWidth + barGap);
    const yTop = midCenter - heightHalf;
    const yBottom = midCenter;

    // 获取 scss 变量
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryColor = rootStyles.getPropertyValue('--js-primary-color').trim();

    ctx.fillStyle = primaryColor || 'red';
    ctx.fillRect(x, yTop, barWidth, heightHalf);
    ctx.fillRect(x, yBottom, barWidth, heightHalf);
  }
};

const randRange = (min: number, max: number) => min + Math.random() * (max - min);

// Float32 → PCM16
const floatTo16BitPCM = (float32Array: Float32Array): ArrayBuffer => {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
};
</script>

<style lang="scss" scoped>
@include b('audio-recorder') {
  @include b('trigger') {
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-drag: none;
  }
}

@include b('audio-recorder-popup') {
  width: 100px;
  height: 45px;
  position: relative;

  > canvas {
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 5px;
    padding: 0 5px;
    box-sizing: border-box;
  }

  &::after {
    content: '';
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 0px;
    height: 0px;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid #fff;
  }
}
</style>
