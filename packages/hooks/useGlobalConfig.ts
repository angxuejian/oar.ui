import { reactive } from "vue";

interface globalConfigType {
  componentStyle: "default" | "oar";
  isDefault: boolean;
}

const globalConfig = reactive<globalConfigType>({
  componentStyle: 'oar',
  isDefault: false
})


// setTimeout(() => {
//   console.log('123ss')
//   globalConfig.isDefault = true;
// }, 5000);

export { globalConfig };
