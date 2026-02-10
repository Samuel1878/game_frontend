
import { getUserBalance } from '@/services/transactionAPI'
import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useWallet = defineStore('wallet', () => {
  const balance = ref<number>(0)
  const freezed_amount = ref<number>(0)
  const lastUpdated_at = ref<string>('')
  const resetWallet = () => {
    balance.value = 0
    freezed_amount.value = 0
    lastUpdated_at.value = ''
  }
  const setWallet = async(name:string | null) => {
    if (!name)return resetWallet();
    const response = await getUserBalance(name);
    if (response){
        console.log("response", response)
    balance.value = Number(response.balance)
    freezed_amount.value = Number(response.freezed_amount ?? 0)
    lastUpdated_at.value = new Date().toISOString()
    }
  
  }


  return {
    balance,
    freezed_amount,
    lastUpdated_at,
    setWallet,
    resetWallet
  }
},{
    // persist:{
    //     key:"wallet",
    //     storage:sessionStorage,
    // }
})
