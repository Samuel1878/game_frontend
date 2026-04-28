
import { defineStore } from 'pinia'
import { ref } from 'vue'
type agentDataType = {
  referral_code:string;
  username:string;
  created_at:string;
}
export const useAgentStore = defineStore('agent', () => {
  const loading = ref(false)
  const agentData = ref<agentDataType|null>(null)
    const setAgentData = (data:agentDataType) => {
        agentData.value = data
    }
  

  return {
    setAgentData,
    agentData,
    loading
  }
})