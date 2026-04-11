import React from 'react';
import { Pencil, Plus, Tag, Wallet } from 'lucide-react';
import Drawer from '../ui/Drawer';
import AlertBanner from '../ui/AlertBanner';

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
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      eyebrow={editingPresupuesto ? 'Editar presupuesto' : 'Nuevo presupuesto'}
      title={editingPresupuesto ? 'Modificar presupuesto' : 'Registrar presupuesto'}
      description="Definí un monto mensual para cada categoría que quieras controlar."
    >
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

          <AlertBanner>{formError}</AlertBanner>

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
    </Drawer>
  );
};

export default PresupuestoFormDrawer;
