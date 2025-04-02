import { get } from  "@/scripts/api/apiClients";

const API_BASE_URL = "/yoga";

export const getPagedYogaPoses = async (queryParams) => {
  return await get(`${API_BASE_URL}/poses`, queryParams);
};