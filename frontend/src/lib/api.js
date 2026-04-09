import axios from 'axios';

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

api.interceptors.request.use((config) => {
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

export default api;
