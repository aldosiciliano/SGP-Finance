import React from 'react';
import { Pencil, Plus, Tag, Wallet, X } from 'lucide-react';

const PresupuestoFormDrawer = ({
  categorias,
  editingPresupuesto,
  form,
  formError,
  isOpen,
  isSubmitting,
  monthLabel,
  onChange,
  onClose,
  onSubmit
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-[rgba(11,31,58,0.38)] backdrop-blur-sm">
      <div className="h-full w-full max-w-xl overflow-y-auto border-l border-[rgba(16,37,66,0.08)] bg-[linear-gradient(180deg,rgba(251,253,255,0.98),rgba(238,244,251,0.96))] shadow-[0_18px_60px_rgba(13,41,80,0.18)]">
        <div className="sticky top-0 z-10 border-b border-[rgba(16,37,66,0.08)] bg-white/85 px-5 py-4 backdrop-blur sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="eyebrow">{editingPresupuesto ? 'Editar presupuesto' : 'Nuevo presupuesto'}</p>
              <h2 className="text-2xl font-bold text-[var(--text)]">
                {editingPresupuesto ? 'Modificar presupuesto' : 'Registrar presupuesto'}
              </h2>
              <p className="text-sm text-[var(--muted)]">
                Definí un monto mensual para cada categoría que quieras controlar.
              </p>
            </div>
            <button className="secondary-button px-3 py-2" onClick={onClose} type="button">
              <X className="h-4 w-4" />
              Cerrar
            </button>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-6">
          <section className="section-card p-5 sm:p-6">
            <form className="space-y-5" onSubmit={onSubmit}>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-[var(--text)]">Categoría</span>
                <div className="input-shell">
                  <span className="input-icon">
                    <Tag />
                  </span>
                  <select
                    className="input input-with-icon"
                    name="categoria_id"
                    value={form.categoria_id}
                    onChange={onChange}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[var(--text)]">Monto</span>
                <div className="input-shell">
                  <span className="input-icon">
                    <Wallet />
                  </span>
                  <input
                    className="input input-with-icon"
                    name="monto"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={form.monto}
                    onChange={onChange}
                  />
                </div>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[var(--text)]">Mes</span>
                  <select className="input" name="mes" value={form.mes} onChange={onChange}>
                    {Array.from({ length: 12 }, (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {monthLabel(index + 1, form.anio)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[var(--text)]">Año</span>
                  <input className="input" name="anio" type="number" min="2000" max="2100" value={form.anio} onChange={onChange} />
                </label>
              </div>

              {formError ? (
                <div className="rounded-3xl border border-[rgba(200,87,87,0.18)] bg-[rgba(200,87,87,0.08)] p-4 text-sm text-[var(--danger)]">
                  {formError}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <button className="secondary-button" onClick={onClose} type="button">
                  Cancelar
                </button>
                <button className="primary-button" disabled={isSubmitting} type="submit">
                  {editingPresupuesto ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {isSubmitting ? 'Guardando...' : editingPresupuesto ? 'Guardar cambios' : 'Guardar presupuesto'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PresupuestoFormDrawer;
