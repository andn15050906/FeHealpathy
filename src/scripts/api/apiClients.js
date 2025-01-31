import axios from "axios";
import { backendApiBase } from '../env';

const apiClient = axios.create({
  baseURL: backendApiBase,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

const formApiClient = axios.create({
  baseURL: backendApiBase,
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  }
});

apiClient.interceptors.request.use(config => {
  return config;
}, error => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(response => {
  return response;
}, error => {
  console.error('API response error:', error.response || error);
  return Promise.reject(error);
});

const apiCall = async (method, url, data = null, params = null) => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
    //handleError(error);
  }
};

const formApiCall = async (method, url, data = null, params = null) => {
  try {
    const response = await formApiClient({
      method,
      url,
      data,
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
    //handleError(error);
  }
};

export const get = (url, params) => apiCall("get", url, null, params);
export const post = (url, data) => apiCall("post", url, data);
export const patch = (url, data) => apiCall("patch", url, data);
export const del = (url) => apiCall("delete", url);

export const postForm = (url, data) => formApiCall("post", url, data);
export const patchForm = (url, data) => formApiCall("patch", url, data);

export default apiClient;