import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setError(null);
    } catch {
      setUser(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await loginUser({ email, password });
      
      await checkAuth();
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Error al iniciar sesión';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, nombre) => {
    try {
      setLoading(true);
      if (password.length > 72) {
        throw new Error('La contraseña no puede tener más de 72 caracteres');
      }
      
      const response = await registerUser({
        email,
        password,
        nombre
      });
      
      await login(email, password);
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Error al registrarse';
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
      setError(null);
    } catch (err) {
      console.error('Error al hacer logout:', err);
      // Igualmente limpiamos el estado local
      setUser(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
