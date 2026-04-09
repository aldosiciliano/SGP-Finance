import { getCategorias } from './categoriasService';
import { get, post, put, remove } from './httpService';

const buildPeriodParams = ({ mes, anio }) => ({
  params: { mes, anio }
});

export const getPresupuestos = ({ mes, anio }) =>
  get('/presupuestos', buildPeriodParams({ mes, anio }));

export const getResumenPresupuesto = ({ mes, anio }) =>
  get('/presupuestos/resumen', buildPeriodParams({ mes, anio }));

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

export const createPresupuesto = (payload) => post('/presupuestos/', payload);

export const updatePresupuesto = (id, payload) =>
  put(`/presupuestos/${id}`, payload);

export const deletePresupuesto = (id) => remove(`/presupuestos/${id}`);
