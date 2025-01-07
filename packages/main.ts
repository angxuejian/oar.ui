import * as Components from "./components/main";
import { type ComponentsType } from "./components/main";


export default {
  install(app: any, options: {}) {

    // 合并用户配置与默认配置
    // Object.assign(globalConfigValue, options);

    // 提供全局变量
    // app.provide(globalConfigKey, globalConfigValue);

    // 挂载this
    // app.config.globalProperties.$isDefault = globalConfigValue.isDefault;

    // 注册组件
    const components: ComponentsType = Components;
    Object.keys(components).forEach((key: string) => {
      app.component(key, components[key]);
    });
  },
};

// declare module '@vue/runtime-core' {
//   interface ComponentCustomProperties {
//     $isDefault: boolean;
//   }
// }
