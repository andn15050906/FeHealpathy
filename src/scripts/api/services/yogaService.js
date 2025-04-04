import { get } from  "@/scripts/api/apiClients";

const API_BASE_URL = "/yoga";
const API_YOGA_RECOMMENDATION = "you-may-like/poses"

export const getPagedYogaPoses = async (queryParams) => {
  return await get(`${API_BASE_URL}/poses`, queryParams);
};

export const getRecommendationPoses = async (queryParams) => {
  return await get(`${API_YOGA_RECOMMENDATION}`, queryParams);
};