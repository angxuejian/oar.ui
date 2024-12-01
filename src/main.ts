import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";

// console.log(App, 'xx')
const app = createApp(App);

app.use(router);

router.isReady().then(() => app.mount("#app"));
