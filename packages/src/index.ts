import * as Components from './components/main'
import { type ComponentsType } from './components/main'
import type { JoystickChangeLinear8WayDataType, JoystickChangeLinear4WayDataType, JoystickChangeRotateDataType } from './components/main'
import { type App } from 'vue'
import '../theme/base.scss'

export type { JoystickChangeLinear8WayDataType, JoystickChangeLinear4WayDataType, JoystickChangeRotateDataType }
export default {
  install(app: App) {
    // 合并用户配置与默认配置
    // Object.assign(globalConfigValue, options);

    // 提供全局变量
    // app.provide(globalConfigKey, globalConfigValue);

    // 挂载this
    // app.config.globalProperties.$isDefault = globalConfigValue.isDefault;

    // 注册组件
    const components: ComponentsType = Components
    Object.keys(components).forEach((key: string) => {
      app.component(key, components[key])
    })
  },
}
