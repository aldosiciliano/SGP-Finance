import api from './api';

export const getPresupuestoData = async ({ mes, anio }) => {
  const [categoriasResponse, presupuestosResponse, resumenResponse] = await Promise.all([
    api.get('/categorias'),
    api.get('/presupuestos', {
      params: { mes, anio }
    }),
    api.get('/presupuestos/resumen', {
      params: { mes, anio }
    })
  ]);

  return {
    categorias: categoriasResponse.data,
    presupuestos: presupuestosResponse.data,
    resumen: resumenResponse.data
  };
};

export const createPresupuesto = (payload) => api.post('/presupuestos/', payload);

export const updatePresupuesto = (id, payload) => api.put(`/presupuestos/${id}`, payload);

export const deletePresupuesto = (id) => api.delete(`/presupuestos/${id}`);
