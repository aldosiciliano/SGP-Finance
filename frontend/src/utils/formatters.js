export const formatDateInput = (value) => new Date(value).toISOString().slice(0, 10);

export const formatCurrency = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(Number(value) || 0);

export const formatDate = (value) =>
  new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
