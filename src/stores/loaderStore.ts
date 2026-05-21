import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoaderStore = defineStore("loader", () => {
  const loading = ref(false);
    function startLoading (){
        loading.value = true;
    }
    function stopLoading () {
        loading.value = false
    }
  return {
    loading,
    startLoading,
    stopLoading
  };
});