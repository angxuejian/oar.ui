<script setup lang="ts">
import { ref, type Ref, onMounted, reactive, computed, onUnmounted } from 'vue';
import { useNamespace } from '@OarUI/hooks'

interface Props {
  // type?: 'linear' | 'rotate',
  // direction?: '4-way' | '8-way',
  width?: number,
  height?: number
}

export interface JoystickChangeDataType {
  direction: string,  // 当前主方向
  isForward: boolean,
  isBackward: boolean,
  isLeft: boolean,
  isRight: boolean,
  isForwardRight: boolean,
  isForwardLeft: boolean,
  isBackwardRight: boolean,
  isBackwardLeft: boolean,
  strength: number,
  angle: number,
  radian: number,
}


const props = withDefaults(defineProps<Props>(), {
  // type: 'linear',
  // direction: '4-way'
  width: 180,
  height: 180
})

const emit = defineEmits(['change'])
const ns = useNamespace('joystick')
const outsideRef: Ref = ref()
const innsideRef: Ref = ref()
const activeTouchId = ref<number>(-1)

const isTouch = ref<boolean>(false)
const isMouse = ref<boolean>(false)
const isKeyboard = ref<boolean>(false)
const isAddEventListener = ref<boolean>(false)
const animation = ref<boolean>(false)

const center = reactive({ x: 0, y: 0 })
const position = reactive({ x: 0, y: 0 })
const radius = ref<number>(0)

const keyboardState = reactive<{ [key: string]: boolean }>({
  w: false,
  a: false,
  s: false,
  d: false,
})

let animationFrameId: number = 0

const innsideStyle = computed(() => {
  return `${animation.value ? 'transition: transform 0.2s ease-out;' : ''} transform: translate(${position.x}px, ${position.y}px)`
})

onMounted(() => {
  updateCenter()

  addEventListenerKeyboard()
})

onUnmounted(() => {
  removeEventListenerKeyboard()
})



const isTargetEvent = (type: 'touch' | 'mouse' | 'keyboard') => {

  if (!isMouse.value && !isKeyboard.value) isTouch.value = type === 'touch'
  if (!isTouch.value && !isKeyboard.value) isMouse.value = type === 'mouse'
  if (!isTouch.value && !isMouse.value) isKeyboard.value = type === 'keyboard'

  // console.log(isMouse.value, isKeyboard.value)

  if (type === 'touch') return !isKeyboard.value && !isMouse.value
  else if (type === 'mouse') return !isTouch.value && !isKeyboard.value
  else return !isTouch.value && !isMouse.value
}

/**
 * keyboard event
 */

const addEventListenerKeyboard = () => {
  window.addEventListener('keydown', keydownHandler)
  window.addEventListener('keyup', keyupHandler)
  window.addEventListener('blur', resetKeyboardEventHandler)
  isAddEventListener.value = false
}

const removeEventListenerKeyboard = () => {
  window.removeEventListener('keydown', keydownHandler)
  window.removeEventListener('keyup', keyupHandler)
  window.removeEventListener('blur', resetKeyboardEventHandler)
  isAddEventListener.value = true
}

const checkKeyboardValue = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase()
  const list = ['w', 's', 'a', 'd']
  return {
    key, check: list.includes(key)
  }
}

const setKeyboard = (key: string, value: boolean) => {
  keyboardState[key] = value
}

const keydownHandler = (e: KeyboardEvent) => {
  if (!isTargetEvent('keyboard')) return
  animation.value = false

  const { key, check } = checkKeyboardValue(e)
  if (!check) return;
  setKeyboard(key, true)

  if (!animationFrameId) updateKeyboardMove()
}

const updateKeyboardMove = () => {
  animation.value = false;

  const linearSpeed = 2 // 控制小圆移动速度

  let x = 0
  let y = 0

  if (keyboardState.w) y -= linearSpeed
  if (keyboardState.s) y += linearSpeed
  if (keyboardState.a) x -= linearSpeed
  if (keyboardState.d) x += linearSpeed

  const distance = Math.sqrt(x * x + y * y)
  if (distance > 0) {
    const dx = position.x + x
    const dy = position.y + y
    calcInnsidePosition(dx, dy)
  }

  animationFrameId = requestAnimationFrame(updateKeyboardMove)
}

const keyupHandler = (e: KeyboardEvent) => {
  if (!isTargetEvent('keyboard')) return

  const { key, check } = checkKeyboardValue(e)
  if (!check) return;
  setKeyboard(key, false)

  if (!Object.values(keyboardState).some(Boolean)) {
    resetPosition()
  }
}

const resetKeyboardEventHandler = () => {
  Object.keys(keyboardState).forEach((key: string) => {
    setKeyboard(key, false)
  })
  resetPosition()
}


/**
 * touch event
 */

const checkTouchThumb = (event: TouchEvent) => {
  return Array.from(event.changedTouches).find(t => t.identifier === activeTouchId.value)
}

const startTouchHandler = (event: TouchEvent) => {
  if (!isTargetEvent('touch')) return

  const checkAndRun = (event: TouchEvent) => {
    const touchData = checkTouchThumb(event)
    if (!touchData) return
    calaMouseTouchXY(touchData.clientX, touchData.clientY)
  }

  const moveTouchHandler = (event: TouchEvent) => {
    if (!isTargetEvent('touch')) return

    checkAndRun(event)
  }

  const endTouchHandler = (event: TouchEvent) => {
    if (!isTargetEvent('touch')) return
    if (!checkTouchThumb(event)) return

    resetPosition()
    window.removeEventListener('touchmove', moveTouchHandler)
    window.removeEventListener('touchend', endTouchHandler)
  }

  animation.value = false
  activeTouchId.value = event.changedTouches[0].identifier
  updateCenter()
  checkAndRun(event)
  removeEventListenerKeyboard()

  window.addEventListener('touchmove', moveTouchHandler)
  window.addEventListener('touchend', endTouchHandler)
}


/**
 * mouse event
 */
const startMouseHandler = (event: MouseEvent) => {
  if (event.button !== 0) return
  if (!isTargetEvent('mouse')) return

  const moveMouseHandler = (event: MouseEvent) => {
    if (!isTargetEvent('mouse')) return

    calaMouseTouchXY(event.clientX, event.clientY)
  }

  const upMouseHandler = () => {
    if (!isTargetEvent('mouse')) return

    resetPosition()
    window.removeEventListener('mousemove', moveMouseHandler)
    window.removeEventListener('mouseup', upMouseHandler)
  }

  animation.value = false
  updateCenter()
  calaMouseTouchXY(event.clientX, event.clientY)
  removeEventListenerKeyboard()

  window.addEventListener('mousemove', moveMouseHandler)
  window.addEventListener('mouseup', upMouseHandler)
}


const updateCenter = () => {
  const outsideRect = outsideRef.value.getBoundingClientRect()
  center.x = outsideRect.left + outsideRect.width / 2
  center.y = outsideRect.top + outsideRect.height / 2

  const outsideRadius = outsideRect.width / 2

  const innsideRect = innsideRef.value.getBoundingClientRect()
  const innsideRadius = innsideRect.width / 2

  radius.value = outsideRadius - innsideRadius
}

const resetPosition = () => {
  isTouch.value = false;
  isMouse.value = false;
  isKeyboard.value = false;
  animation.value = true;

  position.x = 0
  position.y = 0
  activeTouchId.value = -1
  if (isAddEventListener.value) addEventListenerKeyboard()
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = 0
  }
}


const calaMouseTouchXY = (clientX: number, clientY: number) => {
  const dx = clientX - center.x
  const dy = clientY - center.y
  calcInnsidePosition(dx, dy)
}

const calcInnsidePosition = (dx: number, dy: number) => {

  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance > radius.value) {
    const ratio = radius.value / distance
    position.x = dx * ratio
    position.y = dy * ratio
  } else {
    position.x = dx
    position.y = dy
  }

  getJoystickDirection()
}



const getJoystickDirection = () => {
  const dist = Math.sqrt(position.x ** 2 + position.y ** 2)
  const strength = Math.min(dist / radius.value, 1)

  const rad = Math.atan2(position.x, -position.y)
  const deg = (rad * 180) / Math.PI
  const angle = (deg + 360) % 360

  let direction = 'none'

  if (angle >= 337.5 || angle < 22.5) direction = 'forward'
  else if (angle >= 22.5 && angle < 67.5) direction = 'forward-right'
  else if (angle >= 67.5 && angle < 112.5) direction = 'right'
  else if (angle >= 112.5 && angle < 157.5) direction = 'backward-right'
  else if (angle >= 157.5 && angle < 202.5) direction = 'backward'
  else if (angle >= 202.5 && angle < 247.5) direction = 'backward-left'
  else if (angle >= 247.5 && angle < 292.5) direction = 'left'
  else if (angle >= 292.5 && angle < 337.5) direction = 'forward-left'

  const data: JoystickChangeDataType = {
    direction,  // 当前主方向
    isForward: direction === 'forward',
    isBackward: direction === 'backward',
    isLeft: direction === 'left',
    isRight: direction === 'right',
    isForwardRight: direction === 'forward-right',
    isForwardLeft: direction === 'forward-left',
    isBackwardRight: direction === 'backward-right',
    isBackwardLeft: direction === 'backward-left',
    strength: Number(strength.toFixed(2)),
    angle: Math.round(angle),
    radian: Number(rad.toFixed(3)),
  }
  emit('change', data)
}
</script>


<template>
  <div :style="`width: ${props.width}px; height: ${props.height}px;`" @contextmenu.prevent :class="ns.b()">
    <div ref="outsideRef" @touchstart.prevent="startTouchHandler" @mousedown.prevent="startMouseHandler"
      :class="[ns.e('outside')]">
      <div ref="innsideRef" :style="innsideStyle" :class="ns.e('innside')">
        <div :class="ns.e('button')"></div>
      </div>
      <div :class="ns.e('keyborad')">
        <span :class="ns.em('keyborad', 'w')">W</span>
        <span :class="ns.em('keyborad', 'a')">A</span>
        <span :class="ns.em('keyborad', 's')">S</span>
        <span :class="ns.em('keyborad', 'd')">D</span>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.oar-joystick {
  border-radius: 50%;

  &__outside {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    touch-action: none;
    // pointer-events: none;
    border: 2px solid #333;

    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 97%;
      height: 97%;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 50%;
      z-index: 1;
    }

  }

  &__innside {
    width: 50px;
    height: 50px;
    background-color: #fff;
    border: 1px solid #fff;
    box-sizing: border-box;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
  }

  &__button {
    width: 90%;
    height: 90%;
    border: 1px solid #000;
    border-radius: 50%;
    box-sizing: border-box;
  }

  &__keyborad {
    width: 65%;
    height: 65%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    z-index: 2;

    >span {
      display: inline-block;
      position: absolute;
      color: #fff;
      background-color: #4b4b4b94;
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      border-radius: 3px;
      font-size: 13px;
    }

    &--w {
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }

    &--a {
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    &--s {
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }

    &--d {
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
