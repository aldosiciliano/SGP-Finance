import { useEffect, useState } from 'react';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../services/authService';
import { getAuthErrorMessage, validateRegistrationPassword } from '../utils/auth';

export const useAuthSession = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearError = () => {
    setError(null);
  };

  const checkAuth = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setError(null);
      return currentUser;
    } catch {
      setUser(null);
      setError(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      clearError();

      const response = await loginUser({ email, password });
      await checkAuth();

      return response;
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error, 'Error al iniciar sesión');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, nombre) => {
    try {
      setLoading(true);
      clearError();

      validateRegistrationPassword(password);

      const response = await registerUser({
        email,
        password,
        nombre
      });

      await login(email, password);

      return response;
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error, 'Error al registrarse');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      clearError();
    } catch {
      setUser(null);
    }
  };

  return {
    clearError,
    error,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    register,
    user
  };
};
