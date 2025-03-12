import { get } from "@/scripts/api/apiClients";

const API_BASE_URL = "/Recommendations";

export const getRoadmap = async () => {
  return await get(`${API_BASE_URL}/roadmap`);
};