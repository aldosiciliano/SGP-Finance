import api from '../lib/api';

export const getGastos = async (params) => {
  const response = await api.get('/gastos', { params });
  return response.data;
};

export const createGasto = async (payload) => {
  const response = await api.post('/gastos/', payload);
  return response.data;
};

export const updateGasto = async (id, payload) => {
  const response = await api.put(`/gastos/${id}`, payload);
  return response.data;
};

export const deleteGasto = async (id) => {
  const response = await api.delete(`/gastos/${id}`);
  return response.data;
};
