import { buildCategoriesById, getServiceErrorMessage } from './common';

export { buildCategoriesById, getServiceErrorMessage };

export const DASHBOARD_CHART_COLORS = ['#163a70', '#1d8a67', '#4f7db8', '#7a92b2', '#c85757', '#d49b3d'];

const formatMonthLabel = (year, monthIndex) => {
  const date = new Date(year, monthIndex, 1);
  const label = date.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '');
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export const formatExpenseDate = (value) =>
  new Date(value).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short'
  });

export const buildMonthRange = (count) => {
  const now = new Date();

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (count - 1 - index), 1);

    return {
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      label: formatMonthLabel(date.getFullYear(), date.getMonth())
    };
  });
};

export const getCurrentMonthData = (gastos) => {
  const now = new Date();

  return gastos.filter((gasto) => {
    const date = new Date(gasto.fecha);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
};

export const getExpenseCategories = (currentMonthData, categoriasById) => {
  const total = currentMonthData.reduce((accumulator, gasto) => accumulator + Number(gasto.monto_ars || 0), 0);
  const grouped = currentMonthData.reduce((accumulator, gasto) => {
    const categoriaId = gasto.categoria_id || 'sin-categoria';
    const categoriaNombre = categoriasById[categoriaId]?.nombre || 'Sin categoría';

    if (!accumulator[categoriaId]) {
      accumulator[categoriaId] = {
        name: categoriaNombre,
        amount: 0
      };
    }

    accumulator[categoriaId].amount += Number(gasto.monto_ars || 0);
    return accumulator;
  }, {});

  return Object.values(grouped)
    .sort((left, right) => right.amount - left.amount)
    .slice(0, 5)
    .map((category, index) => ({
      ...category,
      value: total ? Math.round((category.amount / total) * 100) : 0,
      color: DASHBOARD_CHART_COLORS[index % DASHBOARD_CHART_COLORS.length]
    }));
};

export const getRecentExpenses = (gastos, categoriasById, formatCurrency) =>
  gastos.slice(0, 4).map((gasto) => ({
    id: gasto.id,
    merchant: gasto.descripcion || 'Sin descripción',
    category: categoriasById[gasto.categoria_id]?.nombre || 'Sin categoría',
    date: formatExpenseDate(gasto.fecha),
    amount: formatCurrency(gasto.monto_ars)
  }));

export const getDashboardStats = (resumen, currentMonthData) => {
  const totalGastado = Number(resumen.total_gastado || 0);
  const totalPresupuestado = Number(resumen.total_presupuestado || 0);
  const totalRestante = Number(resumen.total_restante || 0);
  const average = currentMonthData.length ? totalGastado / currentMonthData.length : 0;
  const usage = totalPresupuestado > 0 ? Math.round((totalGastado / totalPresupuestado) * 100) : 0;

  return {
    totalGastado,
    totalPresupuestado,
    totalRestante,
    average,
    count: currentMonthData.length,
    usage
  };
};

export const getMonthlyExpenseSeries = (monthRange, gastos, monthlyResumes) =>
  monthRange.map(({ label, month, year }, index) => {
    const monthTotal = gastos
      .filter((gasto) => {
        const date = new Date(gasto.fecha);
        return date.getMonth() + 1 === month && date.getFullYear() === year;
      })
      .reduce((accumulator, gasto) => accumulator + Number(gasto.monto_ars || 0), 0);

    return {
      month: label,
      gastos: monthTotal,
      presupuesto: Number(monthlyResumes[index]?.total_presupuestado || 0)
    };
  });
