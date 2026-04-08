import api from '../lib/api';

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (payload) => {
  const response = await api.post('/auth/register', payload);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};
