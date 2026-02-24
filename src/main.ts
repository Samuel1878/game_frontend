import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from "pinia";
import router from './router'; 
import { useAuthStore } from './stores/auth';
const pinia = createPinia();
const app = createApp(App);

app.use(pinia)
app.use(router);

const authStore = useAuthStore();
authStore.autoLogin().then(()=>{
   app.mount("#app");
})

