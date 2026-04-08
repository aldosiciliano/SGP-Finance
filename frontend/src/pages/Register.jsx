import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (localError) setLocalError('');
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }
    
    try {
      await register(formData.email, formData.password, formData.nombre);
      navigate('/dashboard');
    } catch (err) {
      // El error ya se maneja en el AuthContext
    }
  };

  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Completá tus datos para continuar."
    >
      <form className="space-y-4" onSubmit={handleSubmit} autoComplete="on">
        <div className="rounded-3xl bg-[rgba(22,58,112,0.06)] px-4 py-3 text-center text-sm text-[var(--muted)] sm:text-left">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="font-semibold text-[var(--primary)]">
            Iniciá sesión aquí
          </Link>
        </div>

        {(error || localError) && (
          <div className="rounded-3xl bg-[rgba(200,87,87,0.08)] px-4 py-3">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--danger)]" />
              <div>
                <p className="text-sm text-[var(--danger)]">{error || localError}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <AuthInput
            id="nombre"
            name="nombre"
            type="text"
            icon={User}
            placeholder="Nombre (opcional)"
            value={formData.nombre}
            onChange={handleChange}
            autoComplete="name"
          />

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
            minLength="6"
            icon={Lock}
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
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

          <AuthInput
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            minLength="6"
            icon={Lock}
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            trailing={
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--muted)]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
        </div>

        <div className="pt-1">
          <button type="submit" disabled={loading} className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              'Crear cuenta'
            )}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
