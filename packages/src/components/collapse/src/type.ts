
import type { InjectionKey, ModelRef } from 'vue'

export interface selectAllType {
  [key: string]: boolean
}

export interface CollapseProvideType {
  select: ModelRef<string>,
  selectAll: selectAllType
  accordion: boolean,
  disabled: boolean,
  handleSelect: (name: string | undefined) => void;
  handleSelectAll: (name: string | undefined) => void;
}

export const CollapseProvide: InjectionKey<CollapseProvideType> = Symbol('collapse')
