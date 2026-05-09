import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router'; 
import { i18n } from './lib/i18n';

import Particles from "@tsparticles/vue3";
import { loadSlim } from "@tsparticles/slim";
import { useAuthStore } from './stores/auth';

const pinia = createPinia();
const app = createApp(App);
app.use(Particles, {
  init: async (engine) => {
    await loadSlim(engine);
  },
});
app.use(i18n);
app.use(pinia);
const auth = useAuthStore();
async function bootstrap() {
  await auth.init().finally(()=>{
  app.use(router);
  app.mount("#app");
  }); 
}

bootstrap();