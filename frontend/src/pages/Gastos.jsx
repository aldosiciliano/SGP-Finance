import React from 'react';
import { CalendarDays, Pencil, Plus, RefreshCw, Search, Tag, Trash2, Wallet, X } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionPanel from '../components/ui/SectionPanel';
import StatCard from '../components/ui/StatCard';
import { useGastos } from '../hooks/useGastos';
import { formatCurrency, formatDate } from '../utils/formatters';

const Gastos = () => {
  const {
    categorias,
    categoriesById,
    categoryError,
    categoryForm,
    dateFilter,
    editingGasto,
    error,
    filteredGastos,
    form,
    formError,
    handleCategoryFormChange,
    handleCategorySubmit,
    handleDelete,
    handleFormChange,
    handleSubmit,
    isCategoryFormOpen,
    isCreateOpen,
    isCreatingCategory,
    isDeletingId,
    isLoading,
    isSubmitting,
    loadData,
    openCreateForm,
    openEditForm,
    closeCreateForm,
    resetFilters,
    resetForm,
    searchTerm,
    selectedCategory,
    setDateFilter,
    setSearchTerm,
    setSelectedCategory,
    stats,
    toggleCategoryForm
  } = useGastos();

  return (
    <div className="space-y-6">
      <section className="glass-panel px-5 py-6 sm:px-8">
        <PageHeader
          eyebrow="Gestión de gastos"
          title="Registro y seguimiento de gastos"
          description="Consultá tus movimientos, aplicá filtros y administrá cada gasto desde un mismo lugar."
          actions={
            <>
              <button className="secondary-button" onClick={loadData} type="button">
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </button>
              <button className="primary-button" onClick={openCreateForm} type="button" disabled={isLoading}>
                <Plus className="h-4 w-4" />
                Nuevo gasto
              </button>
            </>
          }
        />

        {!isLoading && !categorias.length ? (
          <div className="mt-5 rounded-3xl border border-[rgba(200,87,87,0.18)] bg-[rgba(200,87,87,0.08)] p-4 text-sm text-[var(--danger)]">
            No hay categorías disponibles. Abrí `Nuevo gasto` para crear una categoría desde el mismo panel.
          </div>
        ) : null}
      </section>

      <div className="data-grid">
        <StatCard
          title="Total registrado"
          value={formatCurrency(stats.total)}
          detail={`${stats.count} movimientos`}
          trend={isLoading ? 'Cargando datos' : `${stats.monthCount} este mes`}
        />
        <StatCard
          title="Promedio por gasto"
          value={formatCurrency(stats.average)}
          detail="Calculado sobre movimientos reales"
          trend={selectedCategory ? 'Filtrado activo' : 'Sin filtros por rubro'}
          tone="warning"
        />
        <StatCard
          title="Categorías"
          value={String(categorias.length)}
          detail="Disponibles para asignar"
          trend={categorias.length ? 'Listas para usar' : 'Sin categorías aún'}
          tone="success"
        />
        <StatCard
          title="Resultados visibles"
          value={String(filteredGastos.length)}
          detail="Después de filtros y búsqueda"
          trend={searchTerm ? 'Búsqueda aplicada' : 'Vista completa'}
          tone="danger"
        />
      </div>

      <SectionPanel
        title="Listado de gastos"
        description="Listado de movimientos con búsqueda, edición y eliminación."
      >
        <div className="mb-5 grid gap-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.6fr]">
          <label className="input-shell">
            <span className="input-icon">
              <Search />
            </span>
            <input
              className="input input-with-icon"
              placeholder="Buscar por descripción, categoría o etiqueta"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <select className="input" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>

          <select className="input" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}>
            <option value="">Todas las fechas</option>
            <option value="day">Por día</option>
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
          </select>

          <button className="secondary-button h-full" onClick={resetFilters} type="button">
            Limpiar filtros
          </button>
        </div>

        {error ? (
          <div className="rounded-3xl border border-[rgba(200,87,87,0.18)] bg-[rgba(200,87,87,0.08)] p-4 text-sm text-[var(--danger)]">
            {error}
          </div>
        ) : null}

        {!error && isLoading ? (
          <div className="rounded-3xl border border-[rgba(16,37,66,0.08)] bg-white/70 p-5 text-sm text-[var(--muted)]">
            Cargando gastos y categorías...
          </div>
        ) : null}

        {!error && !isLoading && !filteredGastos.length ? (
          <div className="rounded-3xl border border-[rgba(16,37,66,0.08)] bg-white/70 p-5 text-sm text-[var(--muted)]">
            No hay gastos para mostrar con los filtros actuales.
          </div>
        ) : null}

        {!error && !isLoading && filteredGastos.length ? (
          <div className="overflow-hidden rounded-[24px] border border-[rgba(16,37,66,0.08)]">
            <div className="hidden grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr_1fr] gap-4 bg-[rgba(22,58,112,0.06)] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)] lg:grid">
              <span>Descripción</span>
              <span>Categoría</span>
              <span>Fecha</span>
              <span className="text-right">Monto</span>
              <span className="text-right">Acciones</span>
            </div>

            <div className="divide-y divide-[rgba(16,37,66,0.08)] bg-white/70">
              {filteredGastos.map((gasto) => (
                <div key={gasto.id} className="grid gap-3 px-5 py-4 lg:grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr_1fr] lg:items-center">
                  <div>
                    <p className="font-semibold text-[var(--text)]">{gasto.descripcion || 'Sin descripción'}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {gasto.etiquetas?.length ? gasto.etiquetas.join(', ') : 'Sin etiquetas'}
                    </p>
                  </div>
                  <p className="text-sm text-[var(--text)]">
                    {categoriesById[gasto.categoria_id]?.nombre || `Categoría #${gasto.categoria_id}`}
                  </p>
                  <p className="text-sm text-[var(--muted)]">{formatDate(gasto.fecha)}</p>
                  <p className="text-right text-sm font-semibold text-[var(--text)]">
                    {formatCurrency(gasto.monto_ars)}
                  </p>
                  <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
                    <button className="secondary-button px-3 py-2" onClick={() => openEditForm(gasto)} type="button">
                      <Pencil className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      className="secondary-button px-3 py-2 text-[var(--danger)]"
                      disabled={isDeletingId === gasto.id}
                      onClick={() => handleDelete(gasto)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                      {isDeletingId === gasto.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </SectionPanel>

      {isCreateOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-[rgba(11,31,58,0.38)] backdrop-blur-sm">
          <div className="h-full w-full max-w-xl overflow-y-auto border-l border-[rgba(16,37,66,0.08)] bg-[linear-gradient(180deg,rgba(251,253,255,0.98),rgba(238,244,251,0.96))] shadow-[0_18px_60px_rgba(13,41,80,0.18)]">
            <div className="sticky top-0 z-10 border-b border-[rgba(16,37,66,0.08)] bg-white/85 px-5 py-4 backdrop-blur sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="eyebrow">{editingGasto ? 'Editar gasto' : 'Nuevo gasto'}</p>
                  <h2 className="text-2xl font-bold text-[var(--text)]">{editingGasto ? 'Modificar gasto' : 'Registrar gasto'}</h2>
                  <p className="text-sm text-[var(--muted)]">
                    {editingGasto
                      ? 'Actualizá los datos del movimiento seleccionado.'
                      : 'Completá los datos del movimiento para registrarlo.'}
                  </p>
                </div>
                <button className="secondary-button px-3 py-2" onClick={closeCreateForm} type="button">
                  <X className="h-4 w-4" />
                  Cerrar
                </button>
              </div>
            </div>

            <div className="px-5 py-6 sm:px-6">
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

                        {categoryError ? (
                          <div className="rounded-3xl border border-[rgba(200,87,87,0.18)] bg-[rgba(200,87,87,0.08)] p-4 text-sm text-[var(--danger)]">
                            {categoryError}
                          </div>
                        ) : null}

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

                  {formError ? (
                    <div className="rounded-3xl border border-[rgba(200,87,87,0.18)] bg-[rgba(200,87,87,0.08)] p-4 text-sm text-[var(--danger)]">
                      {formError}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-3">
                    <button className="secondary-button" onClick={closeCreateForm} type="button">
                      Cancelar
                    </button>
                    <button
                      className="secondary-button"
                      onClick={resetForm}
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
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Gastos;
