export const MAX_PASSWORD_LENGTH = 72;

export const getAuthErrorMessage = (error, fallbackMessage) => {
  const detail = error?.response?.data?.detail;

  if (typeof detail === 'string') {
    return detail;
  }

  return error?.message || fallbackMessage;
};

export const validateRegistrationPassword = (password) => {
  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new Error(`La contraseña no puede tener más de ${MAX_PASSWORD_LENGTH} caracteres`);
  }
};
