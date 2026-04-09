import { get } from './httpService';

const buildPeriodParams = ({ mes, anio }) => ({
  params: { mes, anio }
});

export const getCategoryReport = ({ mes, anio }) =>
  get('/reportes/categorias', buildPeriodParams({ mes, anio }));

export const getComparisonReport = ({ mes, anio }) =>
  get('/reportes/comparativa', buildPeriodParams({ mes, anio }));

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
