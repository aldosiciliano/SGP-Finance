import React from 'react';
import { Pencil, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionPanel from '../components/ui/SectionPanel';
import StatCard from '../components/ui/StatCard';
import AlertBanner from '../components/ui/AlertBanner';
import InfoBanner from '../components/ui/InfoBanner';
import GastoFormDrawer from '../components/gastos/GastoFormDrawer';
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
    <div className="panel-page">
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
          <AlertBanner className="mt-5">
            No hay categorías disponibles. Abrí `Nuevo gasto` para crear una categoría desde el mismo panel.
          </AlertBanner>
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

        <AlertBanner>{error}</AlertBanner>

        {!error && isLoading ? (
          <InfoBanner>Cargando gastos y categorías...</InfoBanner>
        ) : null}

        {!error && !isLoading && !filteredGastos.length ? (
          <InfoBanner>No hay gastos para mostrar con los filtros actuales.</InfoBanner>
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

      <GastoFormDrawer
        categorias={categorias}
        categoryError={categoryError}
        categoryForm={categoryForm}
        editingGasto={editingGasto}
        form={form}
        formError={formError}
        handleCategoryFormChange={handleCategoryFormChange}
        handleCategorySubmit={handleCategorySubmit}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
        isCategoryFormOpen={isCategoryFormOpen}
        isCreatingCategory={isCreatingCategory}
        isOpen={isCreateOpen}
        isSubmitting={isSubmitting}
        onClose={closeCreateForm}
        onReset={resetForm}
        toggleCategoryForm={toggleCategoryForm}
      />
    </div>
  );
};

export default Gastos;
