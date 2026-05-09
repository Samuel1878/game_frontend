
import { getAgentDataByIdAPI } from '@/services/agentAPI';
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth';
type agentDataType = {
  referral_code:string;
  username:string;
  created_at:string;
}
export const useAgentStore = defineStore('agent', () => {
  const loading = ref(false);
  const agentData = ref<agentDataType|null>(null);
  const authStore = useAuthStore();
  const fetchAgentData = async () => {
  if (!authStore.user?.agent_id) return;
    loading.value = true
  try {
        const res = await getAgentDataByIdAPI( authStore.user.agent_id);
        console.log("Agent Data", res)
        if (res) {
            agentData.value = res
        }
  } catch (err) {
    console.error(err);
    agentData.value = null
  } finally {
    loading.value = false;
  }
};

  return {
    fetchAgentData,
    agentData,
    loading
  }
})