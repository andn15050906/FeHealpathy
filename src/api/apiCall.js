import axios from "axios";

const API_BASE_URL = "https://localhost:7203/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API response error:", error.response || error);
    return Promise.reject(error);
  }
);

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
    handleError(error);
  }
};

export const get = (url, params) => apiCall("get", url, null, params);
export const post = (url, data) => apiCall("post", url, data);
export const patch = (url, data) => apiCall("patch", url, data);
export const del = (url) => apiCall("delete", url);

export default apiClient;