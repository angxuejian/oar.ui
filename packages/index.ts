import { Components } from './components';
import { type App } from 'vue';
import './theme/base.scss';

export default {
  install(app: App) {
    console.log('执行？');
    // 合并用户配置与默认配置
    // Object.assign(globalConfigValue, options);

    // 提供全局变量
    // app.provide(globalConfigKey, globalConfigValue);

    // 挂载this
    // app.config.globalProperties.$isDefault = globalConfigValue.isDefault;

    // 注册组件
    Object.keys(Components).forEach((key: string) => {
      app.component(key, Components[key]);
    });
  },
};
