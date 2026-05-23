import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router'; 
import { i18n } from './lib/i18n';
import { useAuthStore } from './stores/auth';

const pinia = createPinia();
const app = createApp(App);
app.use(i18n);
app.use(pinia);
app.use(router);
router.isReady().then(() => {
  app.mount('#app');
});;

const auth = useAuthStore();
auth.init();
