import { reactive } from 'vue'

interface GlobalConfigType {
  componentStyle: 'default' | 'oar'
  isDefault: boolean
}

const useGlobalConfig = reactive<GlobalConfigType>({
  componentStyle: 'oar',
  isDefault: false,
})

export { useGlobalConfig }
