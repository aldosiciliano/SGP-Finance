import React, { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionPanel from '../components/ui/SectionPanel';
import PresupuestoFormDrawer from '../components/presupuesto/PresupuestoFormDrawer';
import PresupuestoTable from '../components/presupuesto/PresupuestoTable';
import {
  createPresupuesto,
  deletePresupuesto,
  getPresupuestoData,
  updatePresupuesto
} from '../services/presupuestosService';

const today = new Date();

const INITIAL_FORM = {
  categoria_id: '',
  monto: '',
  mes: String(today.getMonth() + 1),
  anio: String(today.getFullYear())
};

const monthLabel = (month, year) =>
  new Intl.DateTimeFormat('es-AR', {
    month: 'long',
    year: 'numeric'
  }).format(new Date(Number(year), Number(month) - 1, 1));

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(Number(value) || 0);

const Presupuesto = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [resumen, setResumen] = useState({
    total_presupuestado: 0,
    total_gastado: 0,
    total_restante: 0,
    categorias: []
  });
  const [selectedMonth, setSelectedMonth] = useState(String(today.getMonth() + 1));
  const [selectedYear, setSelectedYear] = useState(String(today.getFullYear()));
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPresupuesto, setEditingPresupuesto] = useState(null);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState(INITIAL_FORM);

  const categoriesById = useMemo(
    () =>
      categorias.reduce((accumulator, categoria) => {
        accumulator[categoria.id] = categoria;
        return accumulator;
      }, {}),
    [categorias]
  );

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const { categorias: categoriasData, presupuestos: presupuestosData, resumen: resumenData } = await getPresupuestoData({
        mes: Number(selectedMonth),
        anio: Number(selectedYear)
      });

      setCategorias(categoriasData);
      setPresupuestos(presupuestosData);
      setResumen(resumenData);
      setForm((current) => ({
        ...current,
        categoria_id: current.categoria_id || String(categoriasData[0]?.id || '')
      }));
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'No se pudo cargar el presupuesto.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedYear]);

  const openCreateForm = () => {
    setEditingPresupuesto(null);
    setFormError('');
    setForm({
      categoria_id: String(categorias[0]?.id || ''),
      monto: '',
      mes: selectedMonth,
      anio: selectedYear
    });
    setIsFormOpen(true);
  };

  const openEditForm = (presupuesto) => {
    setEditingPresupuesto(presupuesto);
    setFormError('');
    setForm({
      categoria_id: String(presupuesto.categoria_id),
      monto: String(presupuesto.monto),
      mes: String(presupuesto.mes),
      anio: String(presupuesto.anio)
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingPresupuesto(null);
    setFormError('');
    setIsFormOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.categoria_id || !form.monto || !form.mes || !form.anio) {
      setFormError('Completá categoría, monto, mes y año.');
      return;
    }

    if (Number(form.monto) <= 0) {
      setFormError('El monto debe ser mayor a cero.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError('');

      const payload = {
        categoria_id: Number(form.categoria_id),
        monto: Number(form.monto),
        mes: Number(form.mes),
        anio: Number(form.anio)
      };

      if (editingPresupuesto) {
        await updatePresupuesto(editingPresupuesto.id, payload);
      } else {
        await createPresupuesto(payload);
      }

      closeForm();
      if (String(payload.mes) !== selectedMonth || String(payload.anio) !== selectedYear) {
        setSelectedMonth(String(payload.mes));
        setSelectedYear(String(payload.anio));
      } else {
        await loadData();
      }
    } catch (requestError) {
      const detail = requestError.response?.data?.detail;
      setFormError(typeof detail === 'string' ? detail : 'No se pudo guardar el presupuesto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (presupuesto) => {
    const categoriaNombre = categoriesById[presupuesto.categoria_id]?.nombre || 'esta categoría';
    const confirmed = window.confirm(
      `Vas a eliminar el presupuesto de ${categoriaNombre} para ${monthLabel(presupuesto.mes, presupuesto.anio)}.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeletingId(presupuesto.id);
      setError('');
      await deletePresupuesto(presupuesto.id);
      await loadData();
    } catch (requestError) {
      const detail = requestError.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'No se pudo eliminar el presupuesto.');
    } finally {
      setIsDeletingId(null);
    }
  };

  const totalCategorias = resumen.categorias?.length || 0;
  const resumenByCategoriaId = useMemo(
    () =>
      (resumen.categorias || []).reduce((accumulator, categoria) => {
        accumulator[categoria.categoria_id] = categoria;
        return accumulator;
      }, {}),
    [resumen.categorias]
  );

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
          <div className="mt-5 rounded-3xl border border-[rgba(200,87,87,0.18)] bg-[rgba(200,87,87,0.08)] p-4 text-sm text-[var(--danger)]">
            Primero necesitás crear al menos una categoría para poder asignarle presupuesto.
          </div>
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
            onClick={() => {
              setSelectedMonth(String(today.getMonth() + 1));
              setSelectedYear(String(today.getFullYear()));
            }}
            type="button"
          >
            Ir al mes actual
          </button>
        </div>

        {error ? (
          <div className="rounded-3xl border border-[rgba(200,87,87,0.18)] bg-[rgba(200,87,87,0.08)] p-4 text-sm text-[var(--danger)]">
            {error}
          </div>
        ) : null}

        {!error && isLoading ? (
          <div className="rounded-3xl border border-[rgba(16,37,66,0.08)] bg-white/70 p-5 text-sm text-[var(--muted)]">
            Cargando presupuestos...
          </div>
        ) : null}

        {!error && !isLoading && !presupuestos.length ? (
          <div className="rounded-3xl border border-[rgba(16,37,66,0.08)] bg-white/70 p-5 text-sm text-[var(--muted)]">
            No hay presupuestos cargados para {monthLabel(selectedMonth, selectedYear)}.
          </div>
        ) : null}

        {!error && !isLoading && presupuestos.length ? (
          <PresupuestoTable
            categoriesById={categoriesById}
            formatCurrency={formatCurrency}
            handleDelete={handleDelete}
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
