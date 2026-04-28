import type { transactionsParamsType } from "@/utils/types";
import api from "./api"
export const getAgentDataByIdAPI = async (id:number) => {
    try {
        const response = await api.get(`/agent/get-agent/${id}`);
        if (response.status===200) return response.data;
        return null
    } catch (error) {
        return null
    }
}
export const getUserByAgentAPI = async (agent:number,_currentPage:number, _pageSize:number ) => {
    try {
          const response = await api.get(`/agent/get-users/${agent}?page=${_currentPage}&limit=${_pageSize}`)
        if (response.status===200) return response.data
    } catch (error) {
        
    }
} 


export const getAllTransactionsAPI = async (params:transactionsParamsType)=> {
  try {
        const response = await api.get(`/agent/get-transactions/${params.agent_id}`, {params});
        if (response.status===200)return response.data;
        return null
    } catch (error) {
        return null
    }
};

export const getAgentTransactionSummaryAPI = async (agent_id:number, params:{mode:string, from?:string, to?:string})=>{
  try {
    const response = await api.get(`/agent/transaction-summary/${agent_id}`, {params});
    if (response.status===200)return response.data;
    return null
  } catch (error) {
    return null
  }
}
export const getAgentTransactionSummaryUidAPI = async (agent_id:number, params:{mode:string, from?:string, to?:string, user_id?:number})=>{
  try {
    const response = await api.get(`/agent/transaction-summary-by-uid/${agent_id}`, {params});
    if (response.status===200)return response.data;
    return null
  } catch (error) {
    return null
  }
}