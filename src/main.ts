import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router'; 
import { i18n } from './lib/i18n';

import Particles from "@tsparticles/vue3";
import { loadSlim } from "@tsparticles/slim";

const pinia = createPinia();
const app = createApp(App);
app.use(Particles, {
  init: async (engine) => {
    await loadSlim(engine);
  },
});
app.use(i18n);
app.use(pinia);
app.use(router);

// app.use(Particles, {
//   init: async (engine:Engine) => {
//     await loadSlim(engine);
//   },
// });

// const auth = useAuthStore();

// const boot = async () => {
//   try {
//     await auth.init();
//   } catch (e) {
//     console.error(e);
//   }
// };

// boot();
router.isReady().then(() => {
  app.mount("#app");
});