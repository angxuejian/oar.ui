
import { type Ref } from 'vue'

export function useThumbMouse(wrapRef: Ref, barRef: Ref) {
  let scrollType = 'Y' // mousemove事件中，是X轴滚动还是Y轴滚动
  let isMouse = false // 是否点击滚动条了，未点击不执行mousemove事件

  let startY = 0
  let startScrollTop = 0


  const handleMouseDown = (event: any) => {
    if (event.ctrlKey || event.button === 2) return // 防止右键点击
    isMouse = true

    // 鼠标点击位置距离页面顶部高度 - 滚动条距离页面顶部高度
    if (scrollType === 'Y') {
      startY = event.clientY
      startScrollTop = wrapRef.value.scrollTop
    }

    document.addEventListener('mousemove', handleMouseMove, false)
    document.addEventListener('mouseup', handleMouseUp, false)
    document.onselectstart = () => false // 防止选中
  }

  const handleMouseMove = (event: any) => {
    if (!isMouse) return

    // 移动距离
    const distance = event.clientY - startY

    // 滚动比
    const scrollRatio = wrapRef.value.scrollHeight / barRef.value.clientHeight

    // 滚动距离
    const scrollTop = startScrollTop + distance * scrollRatio
    wrapRef.value.scrollTop = scrollTop
  }

  const handleMouseUp = () => {
    if (!isMouse) return;

    document.removeEventListener('mousemove', handleMouseMove, false)
    document.onselectstart = null
    isMouse = false
  }

  return { handleMouseDown }
}
