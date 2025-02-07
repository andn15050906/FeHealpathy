import apiClient from '@/scripts/api/apiClients';

export const getAssignment = async (id) => {
  try {
    const response = await apiClient.get(`/assignments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch assignment:', error);
    throw error;
  }
};

export const getAssignments = async () => {
  try {
    const response = await apiClient.get(`/assignments`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch assignment:', error);
    throw error;
  }
};

export const getMin = async (id) => {
  try {
    const response = await apiClient.get(`/${id}/min`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch assignment:', error);
    throw error;
  }
};

export const getByAssignmentId = async (assignmentId) => {
  try {
    const response = await apiClient.get(`/submissions/ByAssignment`, {
      params: { assignmentId }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch assignment:', error);
    throw error;
  }
};

export const getByCourse = async (courseId) => {
  try {
    const response = await apiClient.get(`/assignments/ByCourse`, {
      params: { courseId }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch assignment:', error);
    throw error;
  }
};