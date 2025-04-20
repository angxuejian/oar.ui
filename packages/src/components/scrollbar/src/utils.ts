
import { type Ref } from 'vue'

export function useThumbMouse(wrapRef: Ref, barHorizontalRef: Ref, barVerticalRef: Ref) {
  let scrollType = 'Y' // mousemove事件中，是X轴滚动还是Y轴滚动
  let isMouse = false // 是否点击滚动条了，未点击不执行mousemove事件

  let startY = 0
  let startScrollTop = 0
  let startX = 0
  let startScrollLeft = 0
  


  const handleMouseDown = (event: any) => {
    if (event.ctrlKey || event.button === 2) return // 防止右键点击
    isMouse = true
    scrollType = event.target.dataset.type

    // 鼠标点击位置距离页面顶部高度 - 滚动条距离页面顶部高度
    if (scrollType === 'Y') {
      startY = event.clientY
      startScrollTop = wrapRef.value.scrollTop
    } else {
      startX = event.clientX
      startScrollLeft = wrapRef.value.scrollLeft
    }

    document.addEventListener('mousemove', handleMouseMove, false)
    document.addEventListener('mouseup', handleMouseUp, false)
    document.onselectstart = () => false // 防止选中
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!isMouse) return

    // const value = calcScrollValue()
    if (scrollType === 'Y') {
      const scrollTop = calcScrollValue(event, 'Y', startY, startScrollTop)
      wrapRef.value.scrollTop = scrollTop

    } else {
      const scrollLeft = calcScrollValue(event, 'X', startX, startScrollLeft)
      wrapRef.value.scrollLeft = scrollLeft
    }
  }

  const handleMouseUp = () => {
    if (!isMouse) return;

    document.removeEventListener('mousemove', handleMouseMove, false)
    document.onselectstart = null
    isMouse = false
  }

  const calcScrollValue = (event: MouseEvent, type: 'Y' | 'X', startDistance: number, startScroll: number) => {
    if (type === 'Y') {
      // 移动距离
      const distance = event.clientY - startDistance

      // 滚动比
      const scrollRatio = wrapRef.value.scrollHeight / barHorizontalRef.value.clientHeight

      // 滚动距离
      const scrollTop = startScroll + distance * scrollRatio
      return scrollTop

    } else {
      const distance = event.clientX - startDistance
      const scrollRatio = wrapRef.value.scrollWidth / barVerticalRef.value.clientWidth
      const scrollLeft = startScroll + distance * scrollRatio
      return scrollLeft
    }
  }

  const getThumbSize = () => {
    const { clientHeight, scrollHeight, clientWidth, scrollWidth } = wrapRef.value
    console.log(clientWidth, scrollWidth)
    // 滚动条高度 = 盒子高度 / 盒子滚动区域高度 * 换算为百分比
    const height = clientHeight === scrollHeight ? 0 : clientHeight / scrollHeight * 100
    const width  = clientWidth === scrollWidth ? 0 : clientWidth  / scrollWidth  * 100
  
    return { height, width }
  }
  
  const getScrollDistance = (event: any) => {
    const { scrollTop, clientHeight, scrollLeft, clientWidth } = event
  
    // 滚动条滚动高度 = 盒子内容滚动高度 / 盒子滚动区域高度 * 换算为百分比
    const scrollY = scrollTop  / clientHeight * 100
    const scrollX = scrollLeft / clientWidth  * 100
  
    return { scrollY, scrollX }
  }

  return { handleMouseDown, getThumbSize, getScrollDistance, calcScrollValue }
}
