import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoaderStore = defineStore("loader", () => {
  const transitioning = ref(false);

  function start() {
    transitioning.value = true;
  }

  function finish() {
    transitioning.value = false;
  }

  return {
    transitioning,
    start,
    finish,
  };
});