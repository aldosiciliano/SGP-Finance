import api from '../lib/api';

export const getCategoryReport = async ({ mes, anio }) => {
  const response = await api.get('/reportes/categorias', {
    params: { mes, anio }
  });
  return response.data;
};

export const getComparisonReport = async ({ mes, anio }) => {
  const response = await api.get('/reportes/comparativa', {
    params: { mes, anio }
  });
  return response.data;
};

export const getReportesData = async ({ mes, anio }) => {
  const [categorias, comparativa] = await Promise.all([
    getCategoryReport({ mes, anio }),
    getComparisonReport({ mes, anio })
  ]);

  return {
    categorias,
    comparativa
  };
};
