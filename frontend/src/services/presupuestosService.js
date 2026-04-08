import api from '../lib/api';
import { getCategorias } from './categoriasService';

export const getPresupuestos = async ({ mes, anio }) => {
  const response = await api.get('/presupuestos', {
    params: { mes, anio }
  });
  return response.data;
};

export const getResumenPresupuesto = async ({ mes, anio }) => {
  const response = await api.get('/presupuestos/resumen', {
    params: { mes, anio }
  });
  return response.data;
};

export const getPresupuestoData = async ({ mes, anio }) => {
  const [categorias, presupuestos, resumen] = await Promise.all([
    getCategorias(),
    getPresupuestos({ mes, anio }),
    getResumenPresupuesto({ mes, anio })
  ]);

  return {
    categorias,
    presupuestos,
    resumen
  };
};

export const createPresupuesto = async (payload) => {
  const response = await api.post('/presupuestos/', payload);
  return response.data;
};

export const updatePresupuesto = async (id, payload) => {
  const response = await api.put(`/presupuestos/${id}`, payload);
  return response.data;
};

export const deletePresupuesto = async (id) => {
  const response = await api.delete(`/presupuestos/${id}`);
  return response.data;
};
