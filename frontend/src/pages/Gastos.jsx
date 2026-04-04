import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Plus, RefreshCw, Search, Tag, Wallet, X } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionPanel from '../components/ui/SectionPanel';
import StatCard from '../components/ui/StatCard';
import api from '../lib/api';

const formatDateInput = (value) => new Date(value).toISOString().slice(0, 10);

const INITIAL_FORM = {
  monto_ars: '',
  categoria_id: '',
  fecha: formatDateInput(new Date()),
  descripcion: '',
  etiquetas: ''
};

const INITIAL_CATEGORY_FORM = {
  nombre: '',
  icono: '',
  color: '#163a70'
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(Number(value) || 0);

const formatDate = (value) =>
  new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));

const Gastos = () => {
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [form, setForm] = useState(INITIAL_FORM);
  const [categoryForm, setCategoryForm] = useState(INITIAL_CATEGORY_FORM);

  const categoriesById = useMemo(
    () =>
      categorias.reduce((accumulator, categoria) => {
        accumulator[categoria.id] = categoria;
        return accumulator;
      }, {}),
    [categorias]
  );

  const filteredGastos = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return gastos.filter((gasto) => {
      const categoryName = categoriesById[gasto.categoria_id]?.nombre || 'Sin categoría';
      const matchesCategory = selectedCategory ? String(gasto.categoria_id) === selectedCategory : true;
      const matchesSearch = normalizedSearch
        ? [gasto.descripcion, categoryName, ...(gasto.etiquetas || [])]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedSearch))
        : true;

      return matchesCategory && matchesSearch;
    });
  }, [categoriesById, gastos, searchTerm, selectedCategory]);

  const stats = useMemo(() => {
    const total = gastos.reduce((accumulator, gasto) => accumulator + Number(gasto.monto_ars || 0), 0);
    const average = gastos.length ? total / gastos.length : 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonth = gastos.filter((gasto) => {
      const date = new Date(gasto.fecha);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    return {
      total,
      average,
      count: gastos.length,
      monthCount: thisMonth.length
    };
  }, [gastos]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [categoriasResponse, gastosResponse] = await Promise.all([
        api.get('/categorias'),
        api.get('/gastos')
      ]);

      const categoriasData = categoriasResponse.data;
      const gastosData = gastosResponse.data;

      setCategorias(categoriasData);
      setGastos(gastosData);
      setForm((current) => ({
        ...current,
        categoria_id: current.categoria_id || String(categoriasData[0]?.id || '')
      }));
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'No se pudieron cargar los gastos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateForm = () => {
    setFormError('');
    setCategoryError('');
    setIsCategoryFormOpen(!categorias.length);

    setForm((current) => ({
      ...INITIAL_FORM,
      categoria_id: String(categorias[0]?.id || current.categoria_id || '')
    }));
    setIsCreateOpen(true);
  };

  const closeCreateForm = () => {
    setIsCreateOpen(false);
    setFormError('');
    setCategoryError('');
    setIsCategoryFormOpen(false);
  };

  const handleChange = (event) => {
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

      const response = await api.post('/categorias/', {
        nombre: categoryForm.nombre.trim(),
        icono: categoryForm.icono.trim() || null,
        color: categoryForm.color || null
      });

      const newCategory = response.data;

      setCategorias((current) => [...current, newCategory]);
      setForm((current) => ({
        ...current,
        categoria_id: String(newCategory.id)
      }));
      setCategoryForm(INITIAL_CATEGORY_FORM);
      setIsCategoryFormOpen(false);
    } catch (requestError) {
      const detail = requestError.response?.data?.detail;
      setCategoryError(typeof detail === 'string' ? detail : 'No se pudo crear la categoría.');
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

      await api.post('/gastos/', {
        monto_ars: Number(form.monto_ars),
        fecha: new Date(`${form.fecha}T12:00:00`).toISOString(),
        categoria_id: Number(form.categoria_id),
        descripcion: form.descripcion || null,
        etiquetas: form.etiquetas
          ? form.etiquetas
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          : null,
        monto_usd: null
      });

      closeCreateForm();
      await loadData();
    } catch (requestError) {
      const detail = requestError.response?.data?.detail;
      setFormError(
        typeof detail === 'string'
          ? detail
          : 'No se pudo guardar el gasto. Revisá que existan categorías y que el backend tenga sus tablas creadas.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="glass-panel px-5 py-6 sm:px-8">
        <PageHeader
          eyebrow="Gestión de gastos"
          title="Tus gastos con datos reales"
          description="La vista se apoya en categorías y movimientos del backend, con un formulario básico para registrar nuevos gastos."
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
        description="Consulta básica de movimientos registrados con búsqueda por descripción, categoría o etiquetas."
      >
        <div className="mb-5 grid gap-3 lg:grid-cols-[1.2fr_0.8fr_0.6fr]">
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

          <button className="secondary-button h-full" onClick={() => {
            setSearchTerm('');
            setSelectedCategory('');
          }} type="button">
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
            <div className="hidden grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr] gap-4 bg-[rgba(22,58,112,0.06)] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)] lg:grid">
              <span>Descripción</span>
              <span>Categoría</span>
              <span>Fecha</span>
              <span className="text-right">Monto</span>
            </div>

            <div className="divide-y divide-[rgba(16,37,66,0.08)] bg-white/70">
              {filteredGastos.map((gasto) => (
                <div key={gasto.id} className="grid gap-3 px-5 py-4 lg:grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr] lg:items-center">
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
                  <p className="eyebrow">Nuevo gasto</p>
                  <h2 className="text-2xl font-bold text-[var(--text)]">Registrar gasto</h2>
                  <p className="text-sm text-[var(--muted)]">Formulario básico alineado con el backend actual.</p>
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                      onChange={handleChange}
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[var(--text)]">Etiquetas</span>
                    <input
                      className="input"
                      name="etiquetas"
                      placeholder="Opcional. Separalas con coma"
                      value={form.etiquetas}
                      onChange={handleChange}
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
                      onClick={() =>
                        setForm({
                          ...INITIAL_FORM,
                          categoria_id: String(categorias[0]?.id || '')
                        })
                      }
                      type="button"
                    >
                      Limpiar
                    </button>
                    <button className="primary-button" disabled={isSubmitting || !categorias.length} type="submit">
                      <Plus className="h-4 w-4" />
                      {isSubmitting ? 'Guardando...' : 'Guardar gasto'}
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
