import axios from 'axios';
import { backendApiBase } from './env';

const api = axios.create({
  baseURL: backendApiBase,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(response => {
  return response;
}, error => {
  console.error('API response error:', error.response || error);
  return Promise.reject(error);
});

export default api;
