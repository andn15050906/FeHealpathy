import apiClient from '@/scripts/api/apiClients';
import {get, post, postForm, patchForm, del } from '@/scripts/api/apiClients';

const API_BASE_URL = '/Courses';

export const getCourses = async (params = { pageIndex: 0, pageSize: 20 }) => {
  try {
    const response = await apiClient.get(`/Courses`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

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