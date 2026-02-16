import axios from 'axios';
import { getToken } from './auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://vulnerascan2.onrender.com';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor
api.interceptors.request.use((config) => {

  // 🔥 Do NOT attach token for login or signup
  const isAuthRequest =
    config.url.includes('/api/v1/auth/token') ||
    config.url.includes('/api/v1/auth/users/add');

  if (!isAuthRequest) {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
}, (error) => Promise.reject(error));

export default api;

