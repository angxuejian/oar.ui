import { createApp, reactive } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
export * from './utils'
import OarUI from '../packages/main';

// console.log(App, 'xx')
const app = createApp(App);

app.use(router);

app.use(OarUI);

router.isReady().then(() => app.mount("#app"));
