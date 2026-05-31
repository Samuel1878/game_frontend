
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFundPinStore = defineStore('fundPin', () => {
  const isFundPinOpen = ref(false);
  const openFundPin = () => {
    isFundPinOpen.value = true;
  }
  const closeFundPin = () => {
    isFundPinOpen.value = false;
  }
  return {
    isFundPinOpen,
    openFundPin,
    closeFundPin,
  }

})
