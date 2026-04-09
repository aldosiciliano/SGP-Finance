import { getCategorias } from './categoriasService';
import { getGastos } from './gastosService';
import { getResumenPresupuesto } from './presupuestosService';

export const getDashboardData = async (monthRange) => {
  const currentMonth = monthRange[monthRange.length - 1];

  const [categorias, gastos, resumen, ...monthlyResumes] = await Promise.all([
    getCategorias(),
    getGastos({ limit: 1000 }),
    getResumenPresupuesto({
      mes: currentMonth.month,
      anio: currentMonth.year
    }),
    ...monthRange.map(({ month, year }) =>
      getResumenPresupuesto({
        mes: month,
        anio: year
      })
    )
  ]);

  return {
    categorias,
    gastos,
    resumen,
    monthlyResumes
  };
};
