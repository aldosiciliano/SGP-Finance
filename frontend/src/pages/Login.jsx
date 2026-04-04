import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      // El error ya se maneja en el AuthContext
    }
  };

  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Entrá a tu panel financiero con una interfaz más clara y orientada a seguimiento."
    >
      <form className="space-y-4" onSubmit={handleSubmit} autoComplete="on">
        <div className="rounded-3xl bg-[rgba(22,58,112,0.06)] px-4 py-3 text-center text-sm text-[var(--muted)] sm:text-left">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="font-semibold text-[var(--primary)]">
            Registrate aquí
          </Link>
        </div>

        {error && (
          <div className="rounded-3xl bg-[rgba(200,87,87,0.08)] px-4 py-3">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--danger)]" />
              <div>
                <p className="text-sm text-[var(--danger)]">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <AuthInput
            id="email"
            name="email"
            type="email"
            required
            icon={Mail}
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            inputMode="email"
          />

          <AuthInput
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            icon={Lock}
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            trailing={
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--muted)]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
        </div>

        <div className="pt-1">
          <button type="submit" disabled={loading} className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
