import { computed } from 'vue';
import { useGlobalConfig } from '@OarUI/hooks/useGlobalConfig'

export interface UseCommonProps {
  default?: boolean | null;
}

export function useCommonComputed<T extends UseCommonProps>(props: T) {
  const THEME_DEFAULT = computed(() => {
    return (props && props?.default) || useGlobalConfig.isDefault
  });


  return THEME_DEFAULT;
}
