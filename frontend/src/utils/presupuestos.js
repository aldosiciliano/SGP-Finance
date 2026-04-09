export const today = new Date();

export const INITIAL_PRESUPUESTO_FORM = {
  categoria_id: '',
  monto: '',
  mes: String(today.getMonth() + 1),
  anio: String(today.getFullYear())
};

export const monthLabel = (month, year) =>
  new Intl.DateTimeFormat('es-AR', {
    month: 'long',
    year: 'numeric'
  }).format(new Date(Number(year), Number(month) - 1, 1));

export const buildCategoriesById = (categorias) =>
  categorias.reduce((accumulator, categoria) => {
    accumulator[categoria.id] = categoria;
    return accumulator;
  }, {});

export const buildResumenByCategoriaId = (resumenCategorias) =>
  (resumenCategorias || []).reduce((accumulator, categoria) => {
    accumulator[categoria.categoria_id] = categoria;
    return accumulator;
  }, {});

export const mapPresupuestoToForm = (presupuesto) => ({
  categoria_id: String(presupuesto.categoria_id),
  monto: String(presupuesto.monto),
  mes: String(presupuesto.mes),
  anio: String(presupuesto.anio)
});

export const buildPresupuestoPayload = (form) => ({
  categoria_id: Number(form.categoria_id),
  monto: Number(form.monto),
  mes: Number(form.mes),
  anio: Number(form.anio)
});

export const getServiceErrorMessage = (error, fallbackMessage) => {
  const detail = error?.response?.data?.detail;

  if (typeof detail === 'string') {
    return detail;
  }

  return error?.message || fallbackMessage;
};
