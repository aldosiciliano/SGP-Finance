import React from 'react';
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
import { useDashboardData } from '../hooks/useDashboardData';
import { useChromeMessages } from '../hooks/useChromeMessages';
import { formatCurrency } from '../utils/formatters';

const Dashboard = () => {
  const { error, expenseCategories, isLoading, monthlyExpenseSeries, recentExpenses, stats, summaryItems, reload } =
    useDashboardData();

  // Escuchar mensajes de Chrome para recargar cuando se crea un gasto
  useChromeMessages((message) => {
    if (message.type === 'GASTO_CREATED') {
      reload();
    }
  });

  return (
    <div className="panel-page">
      <PageHeader
        eyebrow="Panel"
        title="Resumen financiero"
      />

      <div className="grid gap-2 grid-cols-2">
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
            <ResponsiveContainer width="100%" aspect={1.6} minHeight={160}>
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
