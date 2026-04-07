import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router'; 
import { useAuthStore } from './stores/auth';
import { i18n } from './lib/i18n';

const pinia = createPinia();
const app = createApp(App);
app.use(i18n);
app.use(pinia);
app.use(router);

(async () => {
  try {
    const auth = useAuthStore();
    await auth.init()
    console.log("Auth initialized");
    
    app.mount('#app');
  } catch (err) {
    console.error("Failed to initialize auth:", err);
    window.location.href = "/";
  }
})();