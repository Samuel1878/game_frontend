import type { transactionsParamsType } from "@/utils/types";
import api from "./api";
export const getAgentDataByIdAPI = async (id: number | string) => {
  try {
    const response = await api.get(`/agent/get-agent/${id}`);
    if (response.status === 200) return response.data;
    return null;
  } catch (error) {
    return null;
  }
};
export const getUserByAgentAPI = async (
  agent: number | string,
  _currentPage: number,
  _pageSize: number,
) => {
  try {
    const response = await api.get(
      `/agent/get-users/${agent}?page=${_currentPage}&limit=${_pageSize}`,
    );
    if (response.status === 200) return response.data;
  } catch (error) {}
};

export const getAllTransactionsAPI = async (params: transactionsParamsType) => {
  try {
    const response = await api.get(
      `/agent/get-transactions/${params.agent_id}`,
      { params },
    );
    if (response.status === 200) return response.data;
    return null;
  } catch (error) {
    return null;
  }
};

export const getAgentTransactionSummaryAPI = async (
  agent_id: number | string,
  params: {
    mode: string;
    startDate?: string;
    portfolio?: string;
    endDate?: string;
  },
) => {
  try {
    const response = await api.get(`/agent/transaction-summary/${agent_id}`, {
      params,
    });
    if (response.status === 200) return response.data;
    return null;
  } catch (error) {
    return null;
  }
};
export const getAgentTransactionSummaryUidAPI = async (
  user_id: number | string,
  params: {
    mode: string;
    startDate?: string;
    portfolio?: string;
    endDate?: string;
  },
) => {
  try {
    const response = await api.get(
      `/agent/transaction-summary-by-uid/${user_id}`,
      { params },
    );
    if (response.status === 200) return response.data;
    return null;
  } catch (error) {
    return null;
  }
};
export const getTotalPlayers = async (agent_id: number | string) => {
  try {
    const response = await api.get(`/agent/get-total-players/${agent_id}`);
    if (response.status === 200) return response.data;
    return null;
  } catch (error) {
    return null;
  }
};

// export const getCutomerReportByModifyAPI = async (data:CReportReqParams)=>{
//   try {
//     const response = await api.post("/agent/get-report-by-modify-date", data);
//     if (response.status===200) return response.data;
//     return null
//   } catch (error) {
//     return null
//   }
// }
