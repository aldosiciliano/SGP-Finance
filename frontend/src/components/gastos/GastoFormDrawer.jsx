import React from 'react';
import { CalendarDays, Pencil, Plus, Tag, Wallet } from 'lucide-react';
import Drawer from '../ui/Drawer';
import AlertBanner from '../ui/AlertBanner';

const GastoFormDrawer = ({
  categorias,
  categoryError,
  categoryForm,
  editingGasto,
  form,
  formError,
  handleCategoryFormChange,
  handleCategorySubmit,
  handleFormChange,
  handleSubmit,
  isCategoryFormOpen,
  isCreatingCategory,
  isOpen,
  isSubmitting,
  onClose,
  onReset,
  toggleCategoryForm
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      eyebrow={editingGasto ? 'Editar gasto' : 'Nuevo gasto'}
      title={editingGasto ? 'Modificar gasto' : 'Registrar gasto'}
      description={
        editingGasto
          ? 'Actualizá los datos del movimiento seleccionado.'
          : 'Completá los datos del movimiento para registrarlo.'
      }
    >
      <section className="section-card p-5 sm:p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          {!categorias.length ? (
            <div className="rounded-3xl border border-[rgba(16,37,66,0.08)] bg-[rgba(22,58,112,0.04)] p-4 text-sm text-[var(--muted)]">
              Primero creá una categoría. Cuando la guardes, va a quedar seleccionada automáticamente y después ya podés cargar el gasto.
            </div>
          ) : null}

          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--text)]">Monto</span>
            <div className="input-shell">
              <span className="input-icon">
                <Wallet />
              </span>
              <input
                className="input input-with-icon"
                name="monto_ars"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={form.monto_ars}
                onChange={handleFormChange}
              />
            </div>
          </label>

          <label className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[var(--text)]">Categoría</span>
              <button className="secondary-button px-3 py-2" onClick={toggleCategoryForm} type="button">
                <Plus className="h-4 w-4" />
                {isCategoryFormOpen ? 'Cerrar' : 'Nueva categoría'}
              </button>
            </div>
            <div className="input-shell">
              <span className="input-icon">
                <Tag />
              </span>
              <select
                className="input input-with-icon"
                name="categoria_id"
                value={form.categoria_id}
                onChange={handleFormChange}
                disabled={!categorias.length}
              >
                <option value="">{categorias.length ? 'Seleccionar categoría' : 'Sin categorías disponibles'}</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
          </label>

          {isCategoryFormOpen ? (
            <div className="rounded-[24px] border border-[rgba(16,37,66,0.08)] bg-[rgba(22,58,112,0.04)] p-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--text)]">Crear categoría</p>
                  <p className="text-sm text-[var(--muted)]">La categoría se guarda y queda seleccionada automáticamente.</p>
                </div>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[var(--text)]">Nombre</span>
                  <input
                    className="input"
                    name="nombre"
                    placeholder="Ej. Alimentos"
                    value={categoryForm.nombre}
                    onChange={handleCategoryFormChange}
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[var(--text)]">Icono</span>
                    <input
                      className="input"
                      name="icono"
                      placeholder="Opcional"
                      value={categoryForm.icono}
                      onChange={handleCategoryFormChange}
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[var(--text)]">Color</span>
                    <input
                      className="input h-[50px] px-2 py-2"
                      name="color"
                      type="color"
                      value={categoryForm.color}
                      onChange={handleCategoryFormChange}
                    />
                  </label>
                </div>

                <AlertBanner>{categoryError}</AlertBanner>

                <div className="flex flex-wrap gap-3">
                  <button className="secondary-button" onClick={toggleCategoryForm} type="button">
                    Cancelar
                  </button>
                  <button className="primary-button" disabled={isCreatingCategory} onClick={handleCategorySubmit} type="button">
                    <Plus className="h-4 w-4" />
                    {isCreatingCategory ? 'Guardando...' : 'Guardar categoría'}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--text)]">Fecha</span>
            <div className="input-shell">
              <span className="input-icon">
                <CalendarDays />
              </span>
              <input
                className="input input-with-icon"
                name="fecha"
                type="date"
                value={form.fecha}
                onChange={handleFormChange}
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--text)]">Descripción</span>
            <textarea
              className="input min-h-[110px] resize-none"
              name="descripcion"
              placeholder="Ej. Compra de supermercado"
              value={form.descripcion}
              onChange={handleFormChange}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--text)]">Etiquetas</span>
            <input
              className="input"
              name="etiquetas"
              placeholder="Opcional. Separalas con coma"
              value={form.etiquetas}
              onChange={handleFormChange}
            />
          </label>

          <AlertBanner>{formError}</AlertBanner>

          <div className="flex flex-wrap gap-3">
            <button className="secondary-button" onClick={onClose} type="button">
              Cancelar
            </button>
            <button
              className="secondary-button"
              onClick={onReset}
              type="button"
            >
              Limpiar
            </button>
            <button className="primary-button" disabled={isSubmitting || !categorias.length} type="submit">
              {editingGasto ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {isSubmitting ? 'Guardando...' : editingGasto ? 'Guardar cambios' : 'Guardar gasto'}
            </button>
          </div>
        </form>
      </section>
    </Drawer>
  );
};

export default GastoFormDrawer;
