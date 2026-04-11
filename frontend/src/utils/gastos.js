import { formatDateInput } from './formatters';
import { buildCategoriesById, getServiceErrorMessage } from './common';

export { buildCategoriesById, getServiceErrorMessage };

export const INITIAL_GASTO_FORM = {
  monto_ars: '',
  categoria_id: '',
  fecha: formatDateInput(new Date()),
  descripcion: '',
  etiquetas: ''
};

export const INITIAL_CATEGORY_FORM = {
  nombre: '',
  icono: '',
  color: '#163a70'
};

const isSameDay = (firstDate, secondDate) =>
  firstDate.getFullYear() === secondDate.getFullYear() &&
  firstDate.getMonth() === secondDate.getMonth() &&
  firstDate.getDate() === secondDate.getDate();

const getDateFilterBoundaries = (referenceDate) => {
  const weekStart = new Date(referenceDate);
  weekStart.setDate(referenceDate.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const monthStart = new Date(referenceDate);
  monthStart.setMonth(referenceDate.getMonth() - 1);
  monthStart.setHours(0, 0, 0, 0);

  return { weekStart, monthStart };
};

const matchesDateFilter = (gastoDate, dateFilter, referenceDate, boundaries) => {
  if (dateFilter === 'day') {
    return isSameDay(gastoDate, referenceDate);
  }

  if (dateFilter === 'week') {
    return gastoDate >= boundaries.weekStart;
  }

  if (dateFilter === 'month') {
    return gastoDate >= boundaries.monthStart;
  }

  return true;
};

export const filterGastos = ({
  gastos,
  categoriesById,
  searchTerm,
  selectedCategory,
  dateFilter
}) => {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const now = new Date();
  const dateBoundaries = getDateFilterBoundaries(now);

  return gastos
    .filter((gasto) => {
      const categoryName = categoriesById[gasto.categoria_id]?.nombre || 'Sin categoría';
      const gastoDate = new Date(gasto.fecha);
      const matchesCategory = selectedCategory ? String(gasto.categoria_id) === selectedCategory : true;
      const matchesSearch = normalizedSearch
        ? [gasto.descripcion, categoryName, ...(gasto.etiquetas || [])]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedSearch))
        : true;
      const hasValidDateFilter = matchesDateFilter(gastoDate, dateFilter, now, dateBoundaries);

      return matchesCategory && matchesSearch && hasValidDateFilter;
    })
    .sort((firstGasto, secondGasto) => new Date(secondGasto.fecha).getTime() - new Date(firstGasto.fecha).getTime());
};

export const getGastoStats = (gastos) => {
  const total = gastos.reduce((accumulator, gasto) => accumulator + Number(gasto.monto_ars || 0), 0);
  const average = gastos.length ? total / gastos.length : 0;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonth = gastos.filter((gasto) => {
    const date = new Date(gasto.fecha);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  return {
    total,
    average,
    count: gastos.length,
    monthCount: thisMonth.length
  };
};

export const mapGastoToForm = (gasto) => ({
  monto_ars: String(gasto.monto_ars || ''),
  categoria_id: String(gasto.categoria_id || ''),
  fecha: formatDateInput(gasto.fecha),
  descripcion: gasto.descripcion || '',
  etiquetas: gasto.etiquetas?.join(', ') || ''
});

export const buildGastoPayload = (form) => ({
  monto_ars: Number(form.monto_ars),
  fecha: new Date(`${form.fecha}T12:00:00`).toISOString(),
  categoria_id: Number(form.categoria_id),
  descripcion: form.descripcion || null,
  etiquetas: form.etiquetas
    ? form.etiquetas
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    : null
});

export const buildCategoriaPayload = (categoryForm) => ({
  nombre: categoryForm.nombre.trim(),
  icono: categoryForm.icono.trim() || null,
  color: categoryForm.color || null
});
