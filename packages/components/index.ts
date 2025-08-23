// export { default as OarButton } from './button'

// export type ComponentsType = {
//   [key: string]: any
// }
import type { Component } from 'vue';

import OarButton from './button';
import OarInput from './input';
import OarJoystick from './joystick';
import OarScrollbar from './scrollbar';

export type ComponentsType = Record<string, Component>;

export const Components: ComponentsType = {
  OarButton,
  OarInput,
  OarJoystick,
  OarScrollbar,
};
