<script setup lang="ts">
import { type UseCommonProps, useCommonComputed, useNamespace } from '@OarUI/hooks';
import { X } from 'lucide-vue-next';
import { reactive, computed, onMounted, type Ref, ref } from 'vue';

interface Props {
  title?: string,
  to?: string,
}
const props = withDefaults(defineProps<Props & UseCommonProps>(), {
  title: 'New Tab',
  to: 'body',
});
const THEME_DEFAULT = useCommonComputed(props);
const ns = useNamespace('window');
const windowRef: Ref<HTMLElement | null> = ref(null);
const position = reactive({
  x: 0,
  y: 0,
});

const windowStyle = computed(() => {
  return {
    transform: `translate(${position.x}px, ${position.y}px)`
  }
})

let isDragging = false;
let startPosition = { x: 0, y: 0 };
let windowPosition = { x: 0, y: 0 };
let targetPosition = { x: 0, y: 0 };
let animationId: number | null = null;
let containerRect: DOMRect;
let elementRect: DOMRect;

onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // 暂不支持动态宽高
      const containerEl = document.querySelector(props.to);
      if (!containerEl) return;

      containerRect = containerEl.getBoundingClientRect();
      elementRect = windowRef.value!.getBoundingClientRect();
    });
  });
});

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

  startAnimationLoop();
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

  // 只在第一帧同步即可
  if (!animationId) {
    position.x = targetPosition.x;
    position.y = targetPosition.y;
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
      animationId && cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  animationId = requestAnimationFrame(animate);
}

</script>


<template>
  <div ref="windowRef" :style="windowStyle" :class="ns.b()">

    <div :class="ns.e('tab')">
      <h5 @mousedown="handlerStart" @touchstart="handlerStart">{{ props.title }}</h5>

      <div :class="ns.e('tab-btn')">
        <div :class="ns.e('tab-btn-icon')">
          <X  />
        </div>
      </div>
    </div>

    <div :class="ns.e('content')"></div>
  </div>
</template>


<style lang="scss" scoped>
@include b('window') {
  border: 1px solid transparent;
  width: 300px;
  height: 200px;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  border-radius: var(--oar-border-radius-medium);
  box-shadow: var(--oar-border-shadow-medium);
  overflow: hidden;
  position: fixed;
  transform: translate(0, 0);


  @include e('tab') {
    width: 100%;
    height: 30px;
    background-color: #ededed;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ededed;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: space-between;

    > h5 {
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
    > svg {
      width: 15px;
      height: 15px;
    }
  }

  @include e('content') {
    flex: 1;
    // background-color: red;
  }
}
</style>
