import apiClient from '@/scripts/api/apiClients';

const API_BASE_URL = '/Advisors';

export const getAdvisorProfile = async () => {
  try {
    const response = await apiClient.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching advisor profile:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateAdvisorProfile = async (advisorData) => {
  try {
    const formData = new FormData();
    Object.entries(advisorData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await apiClient.patch(API_BASE_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error updating advisor profile:', error.response ? error.response.data : error.message);
    throw error;
  }
};
