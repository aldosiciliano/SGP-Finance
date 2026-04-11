import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionPanel from '../components/ui/SectionPanel';
import AlertBanner from '../components/ui/AlertBanner';
import InfoBanner from '../components/ui/InfoBanner';
import PresupuestoFormDrawer from '../components/presupuesto/PresupuestoFormDrawer';
import PresupuestoTable from '../components/presupuesto/PresupuestoTable';
import { usePresupuestos } from '../hooks/usePresupuestos';
import { formatCurrency } from '../utils/formatters';
import { monthLabel } from '../utils/presupuestos';

const Presupuesto = () => {
  const {
    categorias,
    categoriesById,
    closeForm,
    editingPresupuesto,
    error,
    form,
    formError,
    handleChange,
    handleDelete,
    handleSubmit,
    isDeletingId,
    isFormOpen,
    isLoading,
    isSubmitting,
    loadData,
    openCreateForm,
    openEditForm,
    presupuestos,
    resetToCurrentPeriod,
    resumen,
    resumenByCategoriaId,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear
  } = usePresupuestos();

  const totalCategorias = resumen.categorias?.length || 0;

  return (
    <div className="space-y-6">
      <section className="glass-panel px-5 py-6 sm:px-8">
        <PageHeader
          eyebrow="Presupuesto"
          title="Definí tu presupuesto mensual"
          description="Configurá montos por categoría y usalos como referencia para ordenar mejor tus gastos."
          actions={
            <>
              <button className="secondary-button" onClick={loadData} type="button">
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </button>
              <button className="primary-button" onClick={openCreateForm} type="button" disabled={isLoading || !categorias.length}>
                <Plus className="h-4 w-4" />
                Nuevo presupuesto
              </button>
            </>
          }
        />

        {!isLoading && !categorias.length ? (
          <AlertBanner className="mt-5">
            Primero necesitás crear al menos una categoría para poder asignarle presupuesto.
          </AlertBanner>
        ) : null}
      </section>

      {totalCategorias ? (
        <SectionPanel
          title="Estado del presupuesto"
          description="Lo que ya se gastó se descuenta automáticamente del presupuesto del mismo mes."
        >
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">Disponible actual</p>
                <p className="text-sm text-[var(--muted)]">
                  {formatCurrency(resumen.total_presupuestado)} presupuestados · {formatCurrency(resumen.total_gastado)} gastados
                </p>
              </div>
              <p className={`text-2xl font-bold ${Number(resumen.total_restante || 0) < 0 ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}>
                {formatCurrency(resumen.total_restante)}
              </p>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[rgba(16,37,66,0.08)]">
              <div
                className={`h-full rounded-full ${Number(resumen.total_restante || 0) < 0 ? 'bg-[var(--danger)]' : 'bg-[var(--accent)]'}`}
                style={{
                  width: `${Math.min(
                    100,
                    totalCategorias && Number(resumen.total_presupuestado || 0) > 0
                      ? (Number(resumen.total_gastado || 0) / Number(resumen.total_presupuestado || 1)) * 100
                      : 0
                  )}%`
                }}
              />
            </div>
          </div>
        </SectionPanel>
      ) : null}

      <SectionPanel
        title="Presupuestos por categoría"
        description="Administrá tus montos planificados para el período seleccionado."
      >
        <div className="mb-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <select className="input" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)}>
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {monthLabel(index + 1, selectedYear)}
              </option>
            ))}
          </select>

          <input
            className="input"
            type="number"
            min="2000"
            max="2100"
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
          />

          <button
            className="secondary-button h-full"
            onClick={resetToCurrentPeriod}
            type="button"
          >
            Ir al mes actual
          </button>
        </div>

        <AlertBanner>{error}</AlertBanner>

        {!error && isLoading ? (
          <InfoBanner>Cargando presupuestos...</InfoBanner>
        ) : null}

        {!error && !isLoading && !presupuestos.length ? (
          <InfoBanner>No hay presupuestos cargados para {monthLabel(selectedMonth, selectedYear)}.</InfoBanner>
        ) : null}

        {!error && !isLoading && presupuestos.length ? (
          <PresupuestoTable
            categoriesById={categoriesById}
            formatCurrency={formatCurrency}
            handleDelete={(presupuesto) => handleDelete(presupuesto, monthLabel)}
            isDeletingId={isDeletingId}
            monthLabel={monthLabel}
            onEdit={openEditForm}
            presupuestos={presupuestos}
            resumenByCategoriaId={resumenByCategoriaId}
          />
        ) : null}
      </SectionPanel>

      <PresupuestoFormDrawer
        categorias={categorias}
        editingPresupuesto={editingPresupuesto}
        form={form}
        formError={formError}
        isOpen={isFormOpen}
        isSubmitting={isSubmitting}
        monthLabel={monthLabel}
        onChange={handleChange}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Presupuesto;
