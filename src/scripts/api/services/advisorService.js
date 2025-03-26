import { patchForm } from '@/scripts/api/apiClients';
import apiClient from '@/scripts/api/apiClients';

const API_BASE_URL = '/Advisors';


export const getAdvisorProfile = async (userId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}?UserId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching advisor profile:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateAdvisorProfile = async (advisorData) => {
    return await patchForm(`${API_BASE_URL}`, advisorData);
};
