<script setup lang="ts">
import { type UseCommonProps, useCommonComputed, useNamespace } from '@OarUI/hooks';
import { X } from 'lucide-vue-next';
import { reactive, computed, onUnmounted, type Ref, ref, watch, nextTick } from 'vue';

interface PositionType {
  x: number;
  y: number;
}

interface Props {
  title?: string,
  to?: string,
  center?: boolean,
  defaultPosition?: PositionType,
  width: number | string,
  height: number | string,
  contentStyle?: string;
  contentClass?: string;
}
const props = withDefaults(defineProps<Props & UseCommonProps>(), {
  title: 'New Tab',
  to: 'body',
  center: false,
  defaultPosition: () => ({ x: 0, y: 0 })
});
const THEME_DEFAULT = useCommonComputed(props);
const ns = useNamespace('window');

const show = defineModel<boolean>('show', { default: false})
const windowRef: Ref<HTMLElement | null> = ref(null);
const position = reactive({
  x: props.defaultPosition.x,
  y: props.defaultPosition.y,
});
const targetPosition = {
  x: props.defaultPosition.x,
  y: props.defaultPosition.y
};

const windowStyle = computed(() => {
  return {
    transform: `translate(${position.x}px, ${position.y}px)`,
  }
})

const contentStyle = computed(() => {
  return [
    {
      width: typeof props.width === 'number' ? `${props.width}px` : props.width,
      height: typeof props.height === 'number' ? `${props.height}px` : props.height,
    },
    props.contentStyle
  ]
})

let isDragging = false;
let startPosition = { x: 0, y: 0 };
let windowPosition = { x: 0, y: 0 };
let animationId: number | null = null;
let containerRect: DOMRect | null = null;
let elementRect: DOMRect | null = null;

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  windowRef.value = null;
  show.value = false;
  position.x = props.defaultPosition.x;
  position.y = props.defaultPosition.y;
  targetPosition.x = props.defaultPosition.x;
  targetPosition.y = props.defaultPosition.y;

  isDragging = false;
  startPosition = { x: 0, y: 0 };
  windowPosition = { x: 0, y: 0 };
  containerRect = null;
  elementRect = null;
})


watch(show, async (newV) => {
  if (!newV) return
  await nextTick()
  await nextFrame()
  await nextFrame()

  const containerEl = document.querySelector(props.to);
  if (!containerEl) return;

  containerRect = containerEl.getBoundingClientRect();
  elementRect = windowRef.value!.getBoundingClientRect();

  if (props.center) {
    const x = (containerRect.width - elementRect.width) / 2;
    const y = (containerRect.height - elementRect.height) / 2;

    position.x = x;
    position.y = y;
    targetPosition.x = x;
    targetPosition.y = y;
  }

  // 可扩展监听 containerEl 变化; 根据 旧位置与旧容器的占比 * 新容器宽高 = 新位置
  // 旧位置要使用原始位置，不是 clampPosition 计算后的
})


const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));

// 限制位置（核心边界函数）
const clampPosition = (x: number, y: number) => {

  if (!containerRect || !elementRect) return { x, y };

  const minX = 0;
  const minY = 0;

  const maxX = containerRect.width - elementRect.width;
  const maxY = containerRect.height - elementRect.height;

  return {
    x: Math.min(maxX, Math.max(minX, x)),
    y: Math.min(maxY, Math.max(minY, y)),
  };
};

const getPointer = (e: MouseEvent | TouchEvent) => {
  if (e instanceof MouseEvent) {
    return { x: e.clientX, y: e.clientY };
  } else {
    const t = e.touches[0];
    return { x: t.clientX, y: t.clientY };
  }
}

const handlerStart = (e: MouseEvent | TouchEvent) => {
  e.preventDefault();
  e.stopPropagation();

  isDragging = true;

  startPosition = getPointer(e);
  windowPosition = { x: position.x, y: position.y };

  if (e instanceof MouseEvent) {
    window.addEventListener('mousemove', handlerMove, { passive: false });
    window.addEventListener('mouseup', handlerEnd, { passive: false });
    window.addEventListener('mouseleave', handlerEnd, { passive: false });
  } else {
    window.addEventListener('touchmove', handlerMove, { passive: false });
    window.addEventListener('touchend', handlerEnd, { passive: false });
    window.addEventListener('touchcancel', handlerEnd, { passive: false });
  }

}

const handlerMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging) return
  e.preventDefault();
  e.stopPropagation();

  const movePosition = getPointer(e);

  // 计算拖拽差值
  const dx = movePosition.x - startPosition.x;
  const dy = movePosition.y - startPosition.y;

  // 基于初始窗口位置偏移
  const x = windowPosition.x + dx;
  const y = windowPosition.y + dy;

  // 计算边界值
  const clampedPosition = clampPosition(x, y);
  targetPosition.x = clampedPosition.x;
  targetPosition.y = clampedPosition.y;

  // 只在未启用时触发
  if (!animationId) {
    startAnimationLoop();
  }
}

const handlerEnd = (e: MouseEvent | TouchEvent) => {
  e.preventDefault();
  e.stopPropagation();

  isDragging = false;

  if (e instanceof MouseEvent) {
    window.removeEventListener('mousemove', handlerMove);
    window.removeEventListener('mouseup', handlerEnd);
    window.removeEventListener('mouseleave', handlerEnd);
  } else {
    window.removeEventListener('touchmove', handlerMove);
    window.removeEventListener('touchend', handlerEnd);
    window.removeEventListener('touchcancel', handlerEnd);
  }
}

const startAnimationLoop = () => {
  if (animationId) return;

  const animate = () => {

    // 平滑动画 / 平滑追随（0.18 可调）
    position.x += (targetPosition.x - position.x) * 0.18;
    position.y += (targetPosition.y - position.y) * 0.18;

    // 判断是否基本到位（阈值）
    const nearX = Math.abs(position.x - targetPosition.x) < 0.5;
    const nearY = Math.abs(position.y - targetPosition.y) < 0.5;

    if (nearX) position.x = targetPosition.x;
    if (nearY) position.y = targetPosition.y;

    // 拖拽中 | 位置还没同步到目标位置时继续执行动画
    if (isDragging || !nearX || !nearY) {
      animationId = requestAnimationFrame(animate);
    } else {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }
  }

  animationId = requestAnimationFrame(animate);
}

const closeWindow = () => {
  show.value = false;
}
</script>


<template>
  <Teleport :to="props.to">
    <Transition name="fade">
      <div v-if="show" ref="windowRef" :style="windowStyle" :class="ns.b()">

        <div :class="ns.e('tab')">
          <h5 @mousedown="handlerStart" @touchstart="handlerStart">{{ props.title }}</h5>

          <div :class="ns.e('tab-btn')">
            <div @click="closeWindow" :class="ns.e('tab-btn-icon')">
              <X />
            </div>
          </div>
        </div>

        <div :style="contentStyle" :class="[ns.e('content'), props.contentClass]"></div>
      </div>
    </Transition>
  </Teleport>
</template>


<style lang="scss" scoped>
@include b('window') {
  border: 1px solid transparent;
  box-sizing: border-box;
  border-radius: var(--oar-border-radius-medium);
  box-shadow: var(--oar-border-shadow-medium);
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
  background-color: var(--oar-white-soft);


  @include e('tab') {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: space-between;

    >h5 {
      flex: 1;
      align-content: center;
      padding-left: 5px;
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 100%;
      cursor: grab;

      &:active {
        cursor: grabbing
      }
    }
  }

  @include e('tab-btn') {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  @include e('tab-btn-icon') {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--oar-black);
    background-color: transparent;
    transition: all 0.3s;

    &:hover {
      color: var(--oar-white);
      background-color: var(--oar-primary-color)
    }

    &:active {
      color: var(--oar-white);
      background-color: var(--oar-primary-color-active);
    }

    >svg {
      width: 15px;
      height: 15px;
    }
  }

  @include e('content') {
    background-color: var(--oar-white);
  }
}
</style>
