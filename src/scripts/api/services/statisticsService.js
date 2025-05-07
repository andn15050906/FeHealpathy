import { get } from  "@/scripts/api/apiClients";

const API_BASE_URL = "/statistics";

export const getProgress = async () => {
  return await get(`${API_BASE_URL}/progress`);
};

export const getSentimentAnalysis = async () => {
  return await get(`${API_BASE_URL}/sentiment`);
}

export const getUserStatistics = async () => {
  return await get(`${API_BASE_URL}/report/general`);
}

export const forceCalcProgress = async () => {
  return await get(`${API_BASE_URL}/force-progress`);
}