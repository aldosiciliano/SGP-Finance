import axios from 'axios';
import { storageGet, storageRemove } from './chromeStorage';

const readCookie = (name) => {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.split('=').slice(1).join('='));
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  const token = await storageGet('jwt_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  const method = config.method?.toLowerCase();
  const csrfProtectedMethods = new Set(['post', 'put', 'patch', 'delete']);

  if (!method || !csrfProtectedMethods.has(method)) {
    return config;
  }

  const csrfToken = readCookie('csrf_token');
  if (!csrfToken) {
    return config;
  }

  config.headers = config.headers || {};
  if (!config.headers['X-CSRF-Token']) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await storageRemove('jwt_token');
      await storageRemove('user_data');
      delete api.defaults.headers.common['Authorization'];
      
      if (window.location.hash !== '#/login' && window.location.pathname !== '/login') {
        window.location.hash = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
