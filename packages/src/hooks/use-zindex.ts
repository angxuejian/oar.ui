import { ref, onMounted, onBeforeUnmount } from 'vue';

let globalZIndex = 6818;
const zIndexStack: number[] = [];

export function useZIndex(autoRelease = true) {
  const currentZIndex = ref<number | null>(null);
  let hasAllocated = false;

  const nextZIndex = () => {
    if (!hasAllocated) {
      globalZIndex += 1;
      currentZIndex.value = globalZIndex;
      zIndexStack.push(globalZIndex);
      hasAllocated = true;
    }
    return currentZIndex.value!;
  };

  const removeZIndex = () => {
    if (hasAllocated && currentZIndex.value !== null) {
      const index = zIndexStack.indexOf(currentZIndex.value);
      if (index !== -1) {
        zIndexStack.splice(index, 1);
      }
      hasAllocated = false;
      currentZIndex.value = null;
    }
  };

  const getMaxZIndex = () => {
    if (zIndexStack.length === 0) return globalZIndex + 1;
    return Math.max(...zIndexStack) + 1;
  };

  onMounted(() => {
    nextZIndex();
  });

  if (autoRelease) {
    onBeforeUnmount(() => {
      removeZIndex();
    });
  }

  return {
    zIndex: currentZIndex,
    nextZIndex,
    removeZIndex,
    getMaxZIndex,
  };
}
