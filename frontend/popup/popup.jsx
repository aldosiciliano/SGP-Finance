import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import '../src/index.css';
import api from '../src/lib/api';
import { Check, ArrowLeft, X } from 'lucide-react';

const STEPS = {
  MONTO: 0,
  CATEGORIA: 1,
  DESCRIPCION: 2,
  SUCCESS: 3
};

function QuickExpensePopup() {
  const [step, setStep] = useState(STEPS.MONTO);
  const [monto, setMonto] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    loadCategorias();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  const loadCategorias = async () => {
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data || []);
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      window.close();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleNext = () => {
    if (step === STEPS.MONTO && !monto) {
      setError('Ingresá un monto');
      return;
    }
    if (step === STEPS.CATEGORIA && !categoriaId) {
      setError('Seleccioná una categoría');
      return;
    }
    
    setError('');
    
    if (step === STEPS.DESCRIPCION) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > STEPS.MONTO) {
      setStep(step - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      await api.post('/gastos', {
        monto: parseFloat(monto),
        categoria_id: parseInt(categoriaId),
        descripcion: descripcion || 'Gasto rápido',
        fecha: new Date().toISOString().split('T')[0]
      });
      
      setStep(STEPS.SUCCESS);
      setTimeout(() => {
        window.close();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al guardar el gasto');
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case STEPS.MONTO:
        return (
          <div className="step-content">
            <label className="step-label">¿Cuánto gastaste?</label>
            <div className="input-wrapper">
              <span className="currency-symbol">$</span>
              <input
                ref={inputRef}
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="0"
                className="step-input"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        );
      
      case STEPS.CATEGORIA:
        return (
          <div className="step-content">
            <label className="step-label">¿En qué categoría?</label>
            <select
              ref={inputRef}
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              onKeyDown={handleKeyDown}
              className="step-select"
            >
              <option value="">Seleccioná una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icono} {cat.nombre}
                </option>
              ))}
            </select>
          </div>
        );
      
      case STEPS.DESCRIPCION:
        return (
          <div className="step-content">
            <label className="step-label">Descripción (opcional)</label>
            <input
              ref={inputRef}
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ej: Almuerzo"
              className="step-input"
              maxLength={100}
            />
          </div>
        );
      
      case STEPS.SUCCESS:
        return (
          <div className="success-content">
            <div className="success-icon">
              <Check size={32} strokeWidth={3} />
            </div>
            <p className="success-text">¡Gasto guardado!</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="popup-container">
      {step !== STEPS.SUCCESS && (
        <div className="popup-header">
          <div className="header-left">
            {step > STEPS.MONTO && (
              <button onClick={handleBack} className="back-button" title="Atrás">
                <ArrowLeft size={16} />
              </button>
            )}
          </div>
          <div className="step-indicator">
            {step + 1} / 3
          </div>
          <button onClick={() => window.close()} className="close-button" title="Cerrar (Esc)">
            <X size={16} />
          </button>
        </div>
      )}
      
      <div className={`popup-body ${step === STEPS.SUCCESS ? 'success' : ''}`}>
        {renderStep()}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
      
      {step !== STEPS.SUCCESS && (
        <div className="popup-footer">
          <button
            onClick={handleNext}
            disabled={loading}
            className="next-button"
          >
            {loading ? 'Guardando...' : step === STEPS.DESCRIPCION ? 'Guardar' : 'Siguiente'}
          </button>
          <div className="hint-text">
            Enter ↵ para continuar · Esc para cerrar
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('popup-root'));
root.render(<QuickExpensePopup />);
