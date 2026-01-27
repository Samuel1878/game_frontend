import Home from "./screens/Home.vue";
import Games from "./screens/Games.vue";
import NotFound from "./screens/NotFound.vue";
import { createMemoryHistory, createRouter } from "vue-router";

const routes = [
  { path: "/", component: Home },
  { path: "/games", component: Games },
  {}
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
