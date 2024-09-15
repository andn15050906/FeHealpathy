import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7277/api', 
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
