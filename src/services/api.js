import axios from 'axios';
import { getToken } from './auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://vulnerascan2.onrender.com';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
});

api.interceptors.request.use(cfg => {
  const token = getToken();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
}, err => Promise.reject(err));

export default api;

