import axios from 'axios';

// Tạo một instance của Axios với cấu hình mặc định 7277 dùng chung
const api = axios.create({
  baseURL: 'https://localhost:7277/api', 
  headers: {
    'Content-Type': 'application/json', 
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Xử lý lỗi response từ API
api.interceptors.response.use(response => {
  return response;
}, error => {
  console.error('API response error:', error.response || error);
  return Promise.reject(error);
});

export default api;
