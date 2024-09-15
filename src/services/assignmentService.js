import api from '@/api/apiCall'; 

export const getAssignment = async (id) => {
  try {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch assignment:', error);
    throw error;
  }
};

export const getAssignments = async () => {
  try {
    const response = await api.get(`/assignments`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch assignment:', error);
    throw error;
  }
};