import { createApp } from 'vue';
import { createPinia } from 'pinia';
// import button from './components/button.vue';
import App from './App.vue';
import router from './router';
import oarui from 'packages';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(oarui)

// 挂载
app.mount('#app');
