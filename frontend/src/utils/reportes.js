export const formatPercent = (value) => {
  if (value === null || value === undefined) return 'Sin base';
  return `${value > 0 ? '+' : ''}${Number(value).toFixed(1)}%`;
};

export const formatMonthYear = (year, month) => {
  if (!year || !month) return 'Sin base';

  return new Date(year, month - 1, 1).toLocaleDateString('es-AR', {
    month: 'long',
    year: 'numeric'
  });
};

export const buildPeriodOptions = (count = 12) => {
  const now = new Date();

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return {
      value: `${year}-${String(month).padStart(2, '0')}`,
      label: formatMonthYear(year, month),
      month,
      year
    };
  });
};

export const getSelectedPeriodParts = (selectedPeriod) => {
  const [year, month] = selectedPeriod.split('-').map(Number);
  return [year, month];
};

export const getSelectedPeriodLabel = (periodOptions, selectedPeriod) =>
  periodOptions.find((option) => option.value === selectedPeriod)?.label || '';

export const getCategoryAnalysis = (categorias) =>
  (categorias || []).map((item) => {
    const totalGastado = Number(item.total_gastado || 0);
    const totalPresupuestado = Number(item.total_presupuestado || 0);
    const diferencia = totalGastado - totalPresupuestado;

    return {
      ...item,
      total_gastado: totalGastado,
      total_presupuestado: totalPresupuestado,
      participacion: Number(item.participacion || 0),
      diferencia,
      uso_presupuesto: totalPresupuestado > 0 ? (totalGastado / totalPresupuestado) * 100 : null
    };
  });

export const getComparisonCategories = (comparisonReport) =>
  (comparisonReport?.categorias || []).map((item) => ({
    ...item,
    actual: Number(item.actual || 0),
    anterior: Number(item.anterior || 0),
    diferencia: Number(item.diferencia || 0)
  }));

export const getBudgetGap = (comparisonReport) =>
  Number(comparisonReport?.actual?.total_gastado || 0) -
  Number(comparisonReport?.actual?.total_presupuestado || 0);

export const getServiceErrorMessage = (error, fallbackMessage) => {
  const detail = error?.response?.data?.detail;

  if (typeof detail === 'string') {
    return detail;
  }

  return error?.message || fallbackMessage;
};
