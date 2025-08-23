<script setup lang="ts">
import { ref, type Ref, onMounted, reactive, computed, onUnmounted } from 'vue';
import { useNamespace } from '../../../hooks'

interface Props {
  type?: 'linear' | 'rotate',
  direction?: '4-way' | '8-way',
  width?: number,
  height?: number,
  linearSpeed?: number,
  rotateSpeed?: number
}


export interface JoystickChangeLinear8WayDataType {
  direction: string,
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


export interface JoystickChangeLinear4WayDataType {
  direction: string,
  isForward: boolean,
  isBackward: boolean,
  isLeft: boolean,
  isRight: boolean,
  strength: number,
  angle: number,
  radian: number,
}

export interface JoystickChangeRotateDataType {
  direction: string,
  isLeft: boolean,
  isRight: boolean,
  strength: number,
  angle: number,
  radian: number,
}


const props = withDefaults(defineProps<Props>(), {
  type: 'linear',
  direction: '4-way',
  width: 180,
  height: 180,
  linearSpeed: 2,
  rotateSpeed: 0.012
})

const emit = defineEmits(['change', 'reset'])
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
const radian = ref<number>(0)

const keyboardState = reactive<{ [key: string]: boolean }>({
  w: false,
  a: false,
  s: false,
  d: false,
  left: false,
  right: false
})

let animationFramekeyboardId: number = 0
let animationFrameTouchId: number = 0
let animationFrameMouseId: number = 0

const innsideStyle = computed(() => {
  return [
    animation.value ? 'transition: transform 0.2s ease-out;' : '',
    `transform: translate(${position.x}px, ${position.y}px)`,
    // props.type === 'rotate' && isKeyboard.value ? '' :
  ]
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
  const list = props.type === 'linear' ? ['w', 's', 'a', 'd'] : ['arrowleft', 'arrowright', ',', '.', '4', '6']
  return {
    key, check: list.includes(key)
  }
}

const setKeyboard = (key: string, value: boolean) => {
  if (['arrowleft', ',', '4'].includes(key)) keyboardState['left'] = value;
  else if (['arrowright', '.', '6'].includes(key)) keyboardState['right'] = value;
  else keyboardState[key] = value
}

const keydownHandler = (e: KeyboardEvent) => {
  if (!isTargetEvent('keyboard')) return
  animation.value = false

  const { key, check } = checkKeyboardValue(e)
  if (!check) return;
  setKeyboard(key, true)

  if (!animationFramekeyboardId) updateKeyboardMove()
}

const updateKeyboardMove = () => {
  animation.value = false;

  const linearSpeed = props.linearSpeed // 控制小圆移动速度
  const rotateSpeed = props.rotateSpeed // 控制小圆移动弧度

  let x = 0
  let y = 0

  if (keyboardState.w) y -= linearSpeed
  if (keyboardState.s) y += linearSpeed
  if (keyboardState.a) x -= linearSpeed
  if (keyboardState.d) x += linearSpeed

  if (keyboardState.left) {
    radian.value -= rotateSpeed
    position.x = Math.sin(radian.value) * radius.value
    position.y = -Math.cos(radian.value) * radius.value
    getJoystickDirection()
  } else if (keyboardState.right) {
    radian.value += rotateSpeed
    position.x = Math.sin(radian.value) * radius.value
    position.y = -Math.cos(radian.value) * radius.value
    getJoystickDirection()
  } else {
    const distance = Math.sqrt(x * x + y * y)
    if (distance > 0) {
      const dx = position.x + x
      const dy = position.y + y
      calcInnsidePosition(dx, dy)
    }
  }

  animationFramekeyboardId = requestAnimationFrame(updateKeyboardMove)
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

  let lastEmitTime = 0;
  const emitInterval = 1000 / 30;

  const loop = () => {
    if (!isTargetEvent('touch')) return

    const now = Date.now()
    if (now - lastEmitTime > emitInterval) {
      getJoystickDirection()
      lastEmitTime = now
    }

    animationFrameTouchId = requestAnimationFrame(loop)
  }

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
  loop()
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

  let lastEmitTime = 0;
  const emitInterval = 1000 / 30;

  const loop = () => {
    if (!isTargetEvent('mouse')) return

    const now = Date.now()
    if (now - lastEmitTime > emitInterval) {
      getJoystickDirection()
      lastEmitTime = now
    }

    animationFrameMouseId = requestAnimationFrame(loop)
  }

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
  loop()
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
  radian.value = 0
  activeTouchId.value = -1
  if (isAddEventListener.value) addEventListenerKeyboard()
  if (animationFramekeyboardId) {
    cancelAnimationFrame(animationFramekeyboardId)
    animationFramekeyboardId = 0
  }
  if (animationFrameMouseId) {
    cancelAnimationFrame(animationFrameMouseId)
    animationFrameMouseId = 0
  }
  if(animationFrameTouchId) {
    cancelAnimationFrame(animationFrameTouchId)
    animationFrameTouchId = 0
  }
  emit('reset')
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
}


const setLinear8WayData = (angle: number, value: { strength: number, angle: number, radian: number }) => {
  let direction = 'none'

  if (angle >= 337.5 || angle < 22.5) direction = 'forward'
  else if (angle >= 22.5 && angle < 67.5) direction = 'forward-right'
  else if (angle >= 67.5 && angle < 112.5) direction = 'right'
  else if (angle >= 112.5 && angle < 157.5) direction = 'backward-right'
  else if (angle >= 157.5 && angle < 202.5) direction = 'backward'
  else if (angle >= 202.5 && angle < 247.5) direction = 'backward-left'
  else if (angle >= 247.5 && angle < 292.5) direction = 'left'
  else if (angle >= 292.5 && angle < 337.5) direction = 'forward-left'

  const data: JoystickChangeLinear8WayDataType = {
    direction,
    isForward: direction === 'forward',
    isBackward: direction === 'backward',
    isLeft: direction === 'left',
    isRight: direction === 'right',
    isForwardRight: direction === 'forward-right',
    isForwardLeft: direction === 'forward-left',
    isBackwardRight: direction === 'backward-right',
    isBackwardLeft: direction === 'backward-left',
    ...value
  }
  emit('change', data)
}

const setLinear4WayData = (angle: number, value: { strength: number, angle: number, radian: number }) => {

  let direction = 'none'

  if (angle >= 315 || angle < 45) direction = 'forward'
  else if (angle >= 45 && angle < 135) direction = 'right'
  else if (angle >= 135 && angle < 225) direction = 'donw'
  else if (angle >= 225 && angle < 315) direction = 'left'

  const data: JoystickChangeLinear4WayDataType = {
    direction,
    isForward: direction === 'forward',
    isBackward: direction === 'backward',
    isLeft: direction === 'left',
    isRight: direction === 'right',
    ...value
  }
  emit('change', data)
}

const setRotateData = (angle: number, value: { strength: number, angle: number, radian: number }) => {
  let direction = 'none'
  if (keyboardState.left) direction = 'left'
  else if (keyboardState.right) direction = 'right'
  else if (angle > 0 && angle <= 180) direction = 'right'
  else if (angle > 180 && angle <= 360) direction = 'left'
  const data: JoystickChangeRotateDataType = {
    direction,
    isLeft: direction === 'left',
    isRight: direction === 'right',
    ...value
  }
  emit('change', data)
}

const getJoystickDirection = () => {
  const dist = Math.sqrt(position.x ** 2 + position.y ** 2)
  const strength = Math.min(dist / radius.value, 1)

  const rad = Math.atan2(position.x, -position.y)
  const deg = (rad * 180) / Math.PI
  const angle = (deg + 360) % 360

  const data = {
    strength: Number(strength.toFixed(2)),
    angle: Math.round(angle),
    radian: Number(rad.toFixed(3)),
  }

  if (props.type === 'linear' && props.direction === '8-way') {
    setLinear8WayData(angle, data)
  } else if (props.type === 'linear' && props.direction === '4-way') {
    setLinear4WayData(angle, data)
  } else {
    setRotateData(angle, data)
  }
}
</script>


<template>
  <div :style="`width: ${props.width}px; height: ${props.height}px;`" @contextmenu.prevent :class="ns.b()">
    <div v-if="props.type === 'linear'" ref="outsideRef" @touchstart.prevent="startTouchHandler"
      @mousedown.prevent="startMouseHandler" :class="[ns.e('outside'), ns.is('linear', true)]">
      <div ref="innsideRef" :style="innsideStyle" :class="ns.e('innside')">
        <div :class="ns.e('button')"></div>
      </div>
      <div :class="ns.e('keyborad')">
        <span :class="[ns.em('keyborad', 'w'), ns.is('light', keyboardState.w)]">W</span>
        <span :class="[ns.em('keyborad', 'a'), ns.is('light', keyboardState.a)]">A</span>
        <span :class="[ns.em('keyborad', 's'), ns.is('light', keyboardState.s)]">S</span>
        <span :class="[ns.em('keyborad', 'd'), ns.is('light', keyboardState.d)]">D</span>
      </div>
    </div>

    <div v-else-if="props.type === 'rotate'" ref="outsideRef" @touchstart.prevent="startTouchHandler"
      @mousedown.prevent="startMouseHandler" :class="[ns.e('outside')]">

      <div ref="innsideRef" :style="innsideStyle" :class="ns.e('innside')">
        <div :class="ns.e('button')"></div>
      </div>
      <div :class="ns.e('keyborad')">
        <span :class="[ns.em('keyborad', 'left'), ns.is('light', keyboardState.left)]"></span>
        <span :class="[ns.em('keyborad', 'right'), ns.is('light', keyboardState.right)]"></span>
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
    border: 2px solid #333;

    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 97%;
      height: 97%;
      background-color: rgba(0, 0, 0, 0.5);
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
    width: 70%;
    height: 70%;
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

    &--a,
    &--left {
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    &--s {
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }

    &--d,
    &--right {
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    &--left {
      &::before {
        content: '';
        position: absolute;
        border-left: 2px solid #fff;
        border-top: 2px solid #fff;
        transform: translate(-25%, -50%) rotate(-45deg);
        top: 50%;
        left: 50%;
        width: 40%;
        height: 40%;
      }
    }

    &--right {
      &::before {
        content: '';
        position: absolute;
        border-right: 2px solid #fff;
        border-top: 2px solid #fff;
        transform: translate(25%, -50%) rotate(45deg);
        top: 50%;
        right: 50%;
        width: 40%;
        height: 40%;
      }
    }

    .is-light {
      &.oar-joystick__keyborad--w, &.oar-joystick__keyborad--a, &.oar-joystick__keyborad--s, &.oar-joystick__keyborad--d {
        color: var(--oar-primary-color)
      }
      &.oar-joystick__keyborad--left {
        &::before {
          border-left-color: var(--oar-primary-color);
          border-top-color: var(--oar-primary-color);
        }
      }

      &.oar-joystick__keyborad--right {
        &::before {
          border-right-color: var(--oar-primary-color);
          border-top-color: var(--oar-primary-color);
        }
      }
    }
  }
}
</style>
