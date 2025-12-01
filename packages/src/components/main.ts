export { default as OarButton } from './button'
export { default as OarInput } from './input'
export { default as OarScrollbar } from './scrollbar'
export { default as OarJoystick } from './joystick'
export { default as OarAudioRecorder } from './audio-recorder'
export { default as OarWindow } from './window'
export { default as OarMask } from './mask'

export type ComponentsType = {
  [key: string]: any
}

import type {
  JoystickChangeLinear8WayDataType,
  JoystickChangeLinear4WayDataType,
  JoystickChangeRotateDataType,
} from './joystick'
export type {
  JoystickChangeLinear8WayDataType,
  JoystickChangeLinear4WayDataType,
  JoystickChangeRotateDataType,
}
