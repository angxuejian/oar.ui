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

export function useCommonComputed<T extends UseCommonProps>(props: T) {
  const THEME_DEFAULT = computed(() => {
    return (props && props?.default) || globalConfig.isDefault
  });


  return THEME_DEFAULT;
}
