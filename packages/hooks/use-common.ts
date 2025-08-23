import { computed } from 'vue';
import { reactive } from 'vue'

interface GlobalConfigType {
  componentStyle: 'default' | 'oar'
  isDefault: boolean
}

const globalConfig = reactive<GlobalConfigType>({
  componentStyle: 'oar',
  isDefault: false,
})

export interface UseCommonProps {
  default?: boolean | null;
}


/**
 * useCommonComputed
 * 用于根据组件 props 和全局配置判断当前主题是否为默认主题。
 *
 * @param props - 组件的 props，需包含 default 字段
 * @returns THEME_DEFAULT - 一个计算属性，表示是否为默认主题
 */
export function useCommonComputed<T extends UseCommonProps>(props: T) {
  const THEME_DEFAULT = computed(() => {
    return (props && props?.default) || globalConfig.isDefault
  });


  return THEME_DEFAULT;
}
