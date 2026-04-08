import api from '../lib/api';

export const getCategorias = async () => {
  const response = await api.get('/categorias');
  return response.data;
};

export const createCategoria = async (payload) => {
  const response = await api.post('/categorias/', payload);
  return response.data;
};
