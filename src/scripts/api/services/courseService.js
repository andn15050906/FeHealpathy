import apiClient from '@/scripts/api/apiClients';
import {get, post, postForm, patchForm, del, getML } from '@/scripts/api/apiClients';

const API_BASE_URL = '/Courses';
const API_COURSE_RECOMMENDATION = "you-may-like/courses"

export const getCourses = async (params = { pageIndex: 0, pageSize: 20 }) => {
  try {
    const response = await apiClient.get(`/Courses`, {
      params: {
        pageIndex: params.pageIndex,
        pageSize: params.pageSize,
        ...(params.creatorId != null && { creatorId: params.creatorId })
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

/*
export const getAllCourses = async () => {
  let allCourses = [];
  let pageIndex = 0;
  const pageSize = 20;

  while (true) {
    const params = { pageIndex, pageSize };
    const response = await getCourses(params);
    const courses = response.items || [];

    allCourses = allCourses.concat(courses);

    if (courses.length < pageSize) {
      break;
    }

    pageIndex++;
  }

  return allCourses;
};
*/

export const getCourseById = async (courseId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course with ID ${courseId}:`, error);
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

export const createCourse = async (courseData) => {
  return await postForm(`${API_BASE_URL}`, courseData);
};

export const updateCourse = async (courseData) => {
  return await patchForm(`${API_BASE_URL}`, courseData);
};

export const deleteCourse = async (courseId) => {
  return await del(`${API_BASE_URL}/${courseId}`);
};

export const getRecommendationCourses = async (queryParams) => {
  return await getML(`${API_COURSE_RECOMMENDATION}`, queryParams);
};

