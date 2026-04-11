export const getServiceErrorMessage = (error, fallbackMessage) => {
  const detail = error?.response?.data?.detail;

  if (typeof detail === 'string') {
    return detail;
  }

  return error?.message || fallbackMessage;
};

export const buildCategoriesById = (categorias) =>
  categorias.reduce((accumulator, categoria) => {
    accumulator[categoria.id] = categoria;
    return accumulator;
  }, {});
