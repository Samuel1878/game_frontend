import type {
  AgentDashboardAgent,
  AgentDashboardAgentDetail,
  AgentDashboardAgentListItem,
  AgentDashboardList,
  AgentDashboardPlayer,
  AgentDashboardPlayerDetail,
  AgentDashboardQuery,
  AgentDashboardSummary,
  AgentDividendPayout,
  CreateDownlineAgentPayload,
  transactionsParamsType,
} from "@/utils/types";
import api from "./api";

const AGENT_DASHBOARD_PATH = "/api/player/agent-dashboard";

export const getAgentDashboardSummary = async (params: AgentDashboardQuery) => {
  const response = await api.get<AgentDashboardSummary>(
    `${AGENT_DASHBOARD_PATH}/summary`,
    { params },
  );
  return response.data;
};

export const getAgentDashboardPlayers = async (params: AgentDashboardQuery) => {
  const response = await api.get<AgentDashboardList<AgentDashboardPlayer>>(
    `${AGENT_DASHBOARD_PATH}/players`,
    { params },
  );
  return response.data;
};

export const getAgentDashboardPlayer = async (
  playerId: string,
  params: AgentDashboardQuery,
) => {
  const response = await api.get<AgentDashboardPlayerDetail>(
    `${AGENT_DASHBOARD_PATH}/players/${playerId}`,
    { params },
  );
  return response.data;
};

export const getAgentDashboardAgents = async (params: AgentDashboardQuery) => {
  const response = await api.get<AgentDashboardList<AgentDashboardAgentListItem>>(
    `${AGENT_DASHBOARD_PATH}/agents`,
    { params },
  );
  return response.data;
};

export const getAgentDashboardAgent = async (
  agentId: string,
  params: AgentDashboardQuery,
) => {
  const response = await api.get<AgentDashboardAgentDetail>(
    `${AGENT_DASHBOARD_PATH}/agents/${agentId}`,
    { params },
  );
  return response.data;
};

export const createAgentDashboardAgent = async (
  payload: CreateDownlineAgentPayload,
) => {
  const response = await api.post<AgentDashboardAgent>(
    `${AGENT_DASHBOARD_PATH}/agents`,
    payload,
  );
  return response.data;
};

export const getAgentDashboardDividends = async (params: AgentDashboardQuery) => {
  const response = await api.get<AgentDashboardList<AgentDividendPayout>>(
    `${AGENT_DASHBOARD_PATH}/dividends`,
    { params },
  );
  return response.data;
};

// Legacy endpoints remain exported for non-agent-center compatibility. New
// agent-center screens use only /api/player/agent-dashboard endpoints above.
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
