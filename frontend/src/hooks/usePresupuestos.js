import { useEffect, useMemo, useState } from 'react';
import {
  createPresupuesto,
  deletePresupuesto,
  getPresupuestoData,
  updatePresupuesto
} from '../services/presupuestosService';
import {
  buildCategoriesById,
  buildPresupuestoPayload,
  buildResumenByCategoriaId,
  getServiceErrorMessage,
  INITIAL_PRESUPUESTO_FORM,
  mapPresupuestoToForm,
  today
} from '../utils/presupuestos';

const INITIAL_RESUMEN = {
  total_presupuestado: 0,
  total_gastado: 0,
  total_restante: 0,
  categorias: []
};

export const usePresupuestos = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [resumen, setResumen] = useState(INITIAL_RESUMEN);
  const [selectedMonth, setSelectedMonth] = useState(String(today.getMonth() + 1));
  const [selectedYear, setSelectedYear] = useState(String(today.getFullYear()));
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPresupuesto, setEditingPresupuesto] = useState(null);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState(INITIAL_PRESUPUESTO_FORM);

  const categoriesById = useMemo(() => buildCategoriesById(categorias), [categorias]);
  const resumenByCategoriaId = useMemo(
    () => buildResumenByCategoriaId(resumen.categorias),
    [resumen.categorias]
  );

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const { categorias: categoriasData, presupuestos: presupuestosData, resumen: resumenData } =
        await getPresupuestoData({
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
      setError(getServiceErrorMessage(requestError, 'No se pudo cargar el presupuesto.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedYear]);

  const resetToCurrentPeriod = () => {
    setSelectedMonth(String(today.getMonth() + 1));
    setSelectedYear(String(today.getFullYear()));
  };

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
    setForm(mapPresupuestoToForm(presupuesto));
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

      const payload = buildPresupuestoPayload(form);

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
      setFormError(getServiceErrorMessage(requestError, 'No se pudo guardar el presupuesto.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (presupuesto, labelBuilder) => {
    const categoriaNombre = categoriesById[presupuesto.categoria_id]?.nombre || 'esta categoría';
    const confirmed = window.confirm(
      `Vas a eliminar el presupuesto de ${categoriaNombre} para ${labelBuilder(presupuesto.mes, presupuesto.anio)}.`
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
      setError(getServiceErrorMessage(requestError, 'No se pudo eliminar el presupuesto.'));
    } finally {
      setIsDeletingId(null);
    }
  };

  return {
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
  };
};
