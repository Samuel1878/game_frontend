import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from "pinia";
import router from './router'; 
import piniaPersist from 'pinia-plugin-persistedstate'
const pinia = createPinia();
const app = createApp(App);

pinia.use(piniaPersist)
app.use(pinia)
app.use(router);
app.mount("#app");

