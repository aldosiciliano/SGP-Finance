import api from '../lib/api';

const getErrorMessage = (error, endpoint) => {
  const apiMessage =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message;

  if (apiMessage) {
    return apiMessage;
  }

  return `Ocurrio un error al consultar el endpoint "${endpoint}"`;
};

const createServiceError = (error, endpoint) => {
  if (error?.name === 'ServiceError') {
    return error;
  }

  const serviceError = new Error(getErrorMessage(error, endpoint), {
    cause: error
  });

  serviceError.name = 'ServiceError';
  serviceError.endpoint = endpoint;
  serviceError.status = error?.response?.status ?? null;
  serviceError.response = error?.response;
  serviceError.data = error?.response?.data ?? null;

  return serviceError;
};

const unwrapData = (response, endpoint) => {
  if (!response) {
    throw createServiceError(null, endpoint);
  }

  if (typeof response.data === 'undefined') {
    throw createServiceError(
      {
        message: `La respuesta del endpoint "${endpoint}" no contiene datos`
      },
      endpoint
    );
  }

  return response.data;
};

const request = async (endpoint, config) => {
  try {
    const response = await api({
      url: endpoint,
      ...config
    });

    return unwrapData(response, endpoint);
  } catch (error) {
    throw createServiceError(error, endpoint);
  }
};

export const get = (endpoint, config = {}) =>
  request(endpoint, { method: 'get', ...config });

export const post = (endpoint, data, config = {}) =>
  request(endpoint, { method: 'post', data, ...config });

export const put = (endpoint, data, config = {}) =>
  request(endpoint, { method: 'put', data, ...config });

export const remove = (endpoint, config = {}) =>
  request(endpoint, { method: 'delete', ...config });
