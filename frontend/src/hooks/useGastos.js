import { useEffect, useMemo, useState } from 'react';
import { createCategoria, getCategorias } from '../services/categoriasService';
import { createGasto, deleteGasto, getGastos, updateGasto } from '../services/gastosService';
import {
  buildCategoriaPayload,
  buildCategoriesById,
  buildGastoPayload,
  filterGastos,
  getGastoStats,
  getServiceErrorMessage,
  INITIAL_CATEGORY_FORM,
  INITIAL_GASTO_FORM,
  mapGastoToForm
} from '../utils/gastos';

export const useGastos = () => {
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingGasto, setEditingGasto] = useState(null);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [form, setForm] = useState(INITIAL_GASTO_FORM);
  const [categoryForm, setCategoryForm] = useState(INITIAL_CATEGORY_FORM);

  const categoriesById = useMemo(() => buildCategoriesById(categorias), [categorias]);
  const filteredGastos = useMemo(
    () =>
      filterGastos({
        gastos,
        categoriesById,
        searchTerm,
        selectedCategory,
        dateFilter
      }),
    [categoriesById, dateFilter, gastos, searchTerm, selectedCategory]
  );
  const stats = useMemo(() => getGastoStats(gastos), [gastos]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [categoriasData, gastosData] = await Promise.all([getCategorias(), getGastos()]);

      setCategorias(categoriasData);
      setGastos(gastosData);
      setForm((current) => ({
        ...current,
        categoria_id: current.categoria_id || String(categoriasData[0]?.id || '')
      }));
    } catch (requestError) {
      setError(getServiceErrorMessage(requestError, 'No se pudieron cargar los gastos.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setDateFilter('');
  };

  const resetForm = () => {
    setForm({
      ...INITIAL_GASTO_FORM,
      categoria_id: String(categorias[0]?.id || '')
    });
  };

  const openCreateForm = () => {
    setFormError('');
    setCategoryError('');
    setEditingGasto(null);
    setIsCategoryFormOpen(!categorias.length);
    setForm({
      ...INITIAL_GASTO_FORM,
      categoria_id: String(categorias[0]?.id || '')
    });
    setIsCreateOpen(true);
  };

  const closeCreateForm = () => {
    setIsCreateOpen(false);
    setFormError('');
    setCategoryError('');
    setIsCategoryFormOpen(false);
    setEditingGasto(null);
  };

  const openEditForm = (gasto) => {
    setFormError('');
    setCategoryError('');
    setEditingGasto(gasto);
    setIsCategoryFormOpen(false);
    setForm(mapGastoToForm(gasto));
    setIsCreateOpen(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleCategoryFormChange = (event) => {
    const { name, value } = event.target;
    setCategoryForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const toggleCategoryForm = () => {
    setCategoryError('');
    setCategoryForm(INITIAL_CATEGORY_FORM);
    setIsCategoryFormOpen((current) => !current);
  };

  const handleCategorySubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!categoryForm.nombre.trim()) {
      setCategoryError('Ingresá un nombre para la categoría.');
      return;
    }

    try {
      setIsCreatingCategory(true);
      setCategoryError('');

      const newCategory = await createCategoria(buildCategoriaPayload(categoryForm));

      setCategorias((current) => [...current, newCategory]);
      setForm((current) => ({
        ...current,
        categoria_id: String(newCategory.id)
      }));
      setCategoryForm(INITIAL_CATEGORY_FORM);
      setIsCategoryFormOpen(false);
    } catch (requestError) {
      setCategoryError(getServiceErrorMessage(requestError, 'No se pudo crear la categoría.'));
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.monto_ars || !form.categoria_id || !form.fecha) {
      setFormError('Completá monto, categoría y fecha.');
      return;
    }

    if (Number(form.monto_ars) <= 0) {
      setFormError('El monto debe ser mayor a cero.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError('');

      const payload = buildGastoPayload(form);

      if (editingGasto) {
        await updateGasto(editingGasto.id, payload);
      } else {
        await createGasto(payload);
      }

      closeCreateForm();
      await loadData();
    } catch (requestError) {
      setFormError(
        getServiceErrorMessage(
          requestError,
          'No se pudo guardar el gasto. Revisá que existan categorías y que el backend tenga sus tablas creadas.'
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (gasto) => {
    const confirmed = window.confirm(
      `Vas a eliminar el gasto "${gasto.descripcion || 'Sin descripción'}". Esta acción no se puede deshacer.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeletingId(gasto.id);
      setError('');
      await deleteGasto(gasto.id);
      await loadData();
    } catch (requestError) {
      setError(getServiceErrorMessage(requestError, 'No se pudo eliminar el gasto.'));
    } finally {
      setIsDeletingId(null);
    }
  };

  return {
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
  };
};
