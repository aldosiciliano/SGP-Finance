import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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

  // Configurar axios para cookies
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:8000';
    axios.defaults.withCredentials = true;
  }, []);

  // Verificar si el usuario está autenticado al cargar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/auth/me');
      setUser(response.data);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post('/auth/login', { email, password });
      
      // Después del login exitoso, verificar usuario
      await checkAuth();
      
      return response.data;
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
      
      // Validar longitud de contraseña (bcrypt limit)
      if (password.length > 72) {
        throw new Error('La contraseña no puede tener más de 72 caracteres');
      }
      
      const response = await axios.post('/auth/register', {
        email,
        password,
        nombre
      });
      
      // Después del registro, hacer login
      await login(email, password);
      
      return response.data;
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
      await axios.post('/auth/logout');
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
