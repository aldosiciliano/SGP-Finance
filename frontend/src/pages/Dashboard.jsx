import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  ChevronRight,
  CreditCard,
  DollarSign,
  Gauge
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionPanel from '../components/ui/SectionPanel';
import StatCard from '../components/ui/StatCard';
import api from '../lib/api';

const CHART_COLORS = ['#163a70', '#1d8a67', '#4f7db8', '#7a92b2', '#c85757', '#d49b3d'];

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(Number(value || 0));

const formatMonthLabel = (year, monthIndex) => {
  const date = new Date(year, monthIndex, 1);
  const label = date.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '');
  return label.charAt(0).toUpperCase() + label.slice(1);
};

const formatExpenseDate = (value) =>
  new Date(value).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short'
  });

const buildMonthRange = (count) => {
  const now = new Date();

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (count - 1 - index), 1);

    return {
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      label: formatMonthLabel(date.getFullYear(), date.getMonth())
    };
  });
};

const Dashboard = () => {
  const [categorias, setCategorias] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [resumen, setResumen] = useState({
    total_presupuestado: 0,
    total_gastado: 0,
    total_restante: 0,
    categorias: []
  });
  const [monthlyExpenseSeries, setMonthlyExpenseSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError('');

        const monthRange = buildMonthRange(6);
        const currentMonth = monthRange[monthRange.length - 1];

        const [categoriasResponse, gastosResponse, resumenResponse, ...monthlyResponses] = await Promise.all([
          api.get('/categorias'),
          api.get('/gastos', { params: { limit: 1000 } }),
          api.get('/presupuestos/resumen', {
            params: {
              mes: currentMonth.month,
              anio: currentMonth.year
            }
          }),
          ...monthRange.map(({ month, year }) =>
            api.get('/presupuestos/resumen', {
              params: { mes: month, anio: year }
            })
          )
        ]);

        const gastosData = gastosResponse.data;

        setCategorias(categoriasResponse.data);
        setGastos(gastosData);
        setResumen(resumenResponse.data);
        setMonthlyExpenseSeries(
          monthRange.map(({ label, month, year }, index) => {
            const monthTotal = gastosData
              .filter((gasto) => {
                const date = new Date(gasto.fecha);
                return date.getMonth() + 1 === month && date.getFullYear() === year;
              })
              .reduce((accumulator, gasto) => accumulator + Number(gasto.monto_ars || 0), 0);

            return {
              month: label,
              gastos: monthTotal,
              presupuesto: Number(monthlyResponses[index].data.total_presupuestado || 0)
            };
          })
        );
      } catch (requestError) {
        setError(requestError.response?.data?.detail || 'No se pudo cargar el dashboard.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const categoriasById = useMemo(
    () =>
      categorias.reduce((accumulator, categoria) => {
        accumulator[categoria.id] = categoria;
        return accumulator;
      }, {}),
    [categorias]
  );

  const currentMonthData = useMemo(() => {
    const now = new Date();

    return gastos.filter((gasto) => {
      const date = new Date(gasto.fecha);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
  }, [gastos]);

  const expenseCategories = useMemo(() => {
    const total = currentMonthData.reduce((accumulator, gasto) => accumulator + Number(gasto.monto_ars || 0), 0);
    const grouped = currentMonthData.reduce((accumulator, gasto) => {
      const categoriaId = gasto.categoria_id || 'sin-categoria';
      const categoriaNombre = categoriasById[categoriaId]?.nombre || 'Sin categoría';

      if (!accumulator[categoriaId]) {
        accumulator[categoriaId] = {
          name: categoriaNombre,
          amount: 0
        };
      }

      accumulator[categoriaId].amount += Number(gasto.monto_ars || 0);
      return accumulator;
    }, {});

    return Object.values(grouped)
      .sort((left, right) => right.amount - left.amount)
      .slice(0, 5)
      .map((category, index) => ({
        ...category,
        value: total ? Math.round((category.amount / total) * 100) : 0,
        color: CHART_COLORS[index % CHART_COLORS.length]
      }));
  }, [categoriasById, currentMonthData]);

  const recentExpenses = useMemo(
    () =>
      gastos.slice(0, 4).map((gasto) => ({
        id: gasto.id,
        merchant: gasto.descripcion || 'Sin descripción',
        category: categoriasById[gasto.categoria_id]?.nombre || 'Sin categoría',
        date: formatExpenseDate(gasto.fecha),
        amount: formatCurrency(gasto.monto_ars)
      })),
    [categoriasById, gastos]
  );

  const stats = useMemo(() => {
    const totalGastado = Number(resumen.total_gastado || 0);
    const totalPresupuestado = Number(resumen.total_presupuestado || 0);
    const totalRestante = Number(resumen.total_restante || 0);
    const average = currentMonthData.length ? totalGastado / currentMonthData.length : 0;
    const usage = totalPresupuestado > 0 ? Math.round((totalGastado / totalPresupuestado) * 100) : 0;

    return {
      totalGastado,
      totalPresupuestado,
      totalRestante,
      average,
      count: currentMonthData.length,
      usage
    };
  }, [currentMonthData.length, resumen.total_gastado, resumen.total_presupuestado, resumen.total_restante]);

  const summaryItems = useMemo(
    () => [
      {
        label: 'Movimientos',
        value: `${stats.count}`,
        detail: 'este mes'
      },
      {
        label: 'Promedio',
        value: formatCurrency(stats.average),
        detail: 'por gasto'
      },
      {
        label: 'Categoría líder',
        value: expenseCategories[0]?.name || 'Sin datos',
        detail: expenseCategories[0] ? `${expenseCategories[0].value}% del gasto` : 'sin datos'
      }
    ],
    [expenseCategories, stats.average, stats.count]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Panel"
        title="Resumen financiero"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Gasto del mes"
          value={isLoading ? '...' : formatCurrency(stats.totalGastado)}
          detail={isLoading ? 'Cargando' : `${stats.count} movimientos`}
          trend={error ? 'Sin datos' : 'Acumulado'}
          icon={DollarSign}
          tone="default"
        />
        <StatCard
          title="Disponible"
          value={isLoading ? '...' : formatCurrency(stats.totalRestante)}
          detail={isLoading ? 'Cargando' : `De ${formatCurrency(stats.totalPresupuestado)}`}
          trend={
            error
              ? 'Sin datos'
              : stats.totalPresupuestado > 0
                ? `${stats.usage}% usado`
                : 'Sin presupuesto'
          }
          icon={CreditCard}
          tone="warning"
        />
        <StatCard
          title="Presupuesto usado"
          value={isLoading ? '...' : `${stats.usage}%`}
          detail={
            isLoading
              ? 'Cargando'
              : stats.totalPresupuestado > 0
                ? formatCurrency(stats.totalGastado)
                : 'Sin presupuesto'
          }
          trend={stats.count ? `${stats.count} movimientos` : 'Sin gastos'}
          icon={Gauge}
          tone="success"
        />
      </div>

      <SectionPanel title="Lectura rápida">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {summaryItems.map((item) => (
            <div key={item.label} className="rounded-[22px] border border-[rgba(16,37,66,0.08)] bg-[rgba(22,58,112,0.03)] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{item.label}</p>
              <p className="mt-2 text-lg font-bold text-[var(--text)] sm:text-xl">{item.value}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{item.detail}</p>
            </div>
          ))}
        </div>
      </SectionPanel>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
        <SectionPanel
          title="Evolución mensual"
        >
          {error ? (
            <p className="text-sm text-[var(--danger)]">{error}</p>
          ) : (
            <div className="h-[260px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyExpenseSeries}>
                  <defs>
                    <linearGradient id="gastosFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#163a70" stopOpacity={0.32} />
                      <stop offset="95%" stopColor="#163a70" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#dbe6f2" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#5e7490', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#5e7490', fontSize: 12 }} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="presupuesto" stroke="#7a92b2" strokeWidth={2} fill="transparent" />
                  <Area type="monotone" dataKey="gastos" stroke="#163a70" strokeWidth={3} fill="url(#gastosFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionPanel>

        <SectionPanel title="Distribución por categoría">
          {error ? (
            <p className="text-sm text-[var(--danger)]">{error}</p>
          ) : !expenseCategories.length ? (
            <p className="text-sm text-[var(--muted)]">Todavía no hay gastos este mes para mostrar distribución.</p>
          ) : (
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
              <div className="mx-auto h-[200px] w-full max-w-[220px] shrink-0 sm:h-[220px] sm:max-w-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      dataKey="amount"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={84}
                      paddingAngle={4}
                      stroke="rgba(255,255,255,0.95)"
                      strokeWidth={2}
                    >
                      {expenseCategories.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, _name, props) => [formatCurrency(props?.payload?.amount), props?.payload?.name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="min-w-0 flex-1 space-y-2.5">
                {expenseCategories.map((category) => (
                  <div key={category.name} className="border-b border-[rgba(16,37,66,0.08)] pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <span className="status-dot mt-1 shrink-0" style={{ backgroundColor: category.color }} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="min-w-0 flex-1 break-words text-sm font-semibold leading-tight text-[var(--text)]">
                            {category.name}
                          </p>
                          <p className="shrink-0 whitespace-nowrap text-sm font-semibold text-[var(--text)]">
                            {formatCurrency(category.amount)}
                          </p>
                        </div>
                        <p className="mt-1 text-xs font-medium text-[var(--muted)]">{category.value}% del mes</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionPanel>
      </div>

      <div className="grid gap-6">
        <SectionPanel
          title="Últimos movimientos"
          action={
            <Link className="secondary-button w-full sm:w-auto" to="/gastos">
              Ver todos
              <ChevronRight className="h-4 w-4" />
            </Link>
          }
        >
          {error ? (
            <p className="text-sm text-[var(--danger)]">{error}</p>
          ) : !recentExpenses.length ? (
            <p className="text-sm text-[var(--muted)]">Todavía no hay movimientos cargados.</p>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="rounded-3xl bg-[rgba(22,58,112,0.04)] p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 space-y-1">
                      <p className="truncate font-semibold text-[var(--text)]">{expense.merchant}</p>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
                        <span>{expense.category}</span>
                        <span className="h-1 w-1 rounded-full bg-[#b5c7db]" />
                        <span>{expense.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 lg:justify-end">
                      <p className="text-sm font-semibold text-[var(--text)] sm:text-base">{expense.amount}</p>
                      <span className="pill whitespace-nowrap">Registrado</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionPanel>
      </div>
    </div>
  );
};

export default Dashboard;
