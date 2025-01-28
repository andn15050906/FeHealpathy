import apiClient from '@/scripts/api/apiClients';

export const getCourses = async () => {
  try {
    const response = await apiClient.get('/Courses');
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getCourseDetail = async (courseId) => {
  try {
    const response = await apiClient.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course ${courseId}:`, error);
    throw error;
  }
};

export const getDiscountedCourses = async () => {
  try {
    const response = await apiClient.get('/courses/discounted');
    return response.data;
  } catch (error) {
    console.error('Error fetching discounted courses:', error);
    throw error;
  }
};
