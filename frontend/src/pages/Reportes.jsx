import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { ArrowRightLeft, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionPanel from '../components/ui/SectionPanel';
import StatCard from '../components/ui/StatCard';
import { useReportes } from '../hooks/useReportes';
import { formatCurrency } from '../utils/formatters';
import { formatMonthYear, formatPercent } from '../utils/reportes';

const LoadingRows = ({ rows = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }, (_, index) => (
      <div
        key={index}
        className="h-16 animate-pulse rounded-2xl border border-[rgba(16,37,66,0.06)] bg-[rgba(22,58,112,0.05)]"
      />
    ))}
  </div>
);

const tooltipFormatter = (value) => formatCurrency(value);
const chartMargin = { left: 4, right: 8, top: 4, bottom: 4 };

const Reportes = () => {
  const {
    budgetGap,
    budgetGapTone,
    categoryAnalysis,
    comparisonCategories,
    comparisonDelta,
    comparisonReport,
    error,
    isLoading,
    periodOptions,
    selectedPeriod,
    selectedPeriodLabel,
    setSelectedPeriod,
    topCategory
  } = useReportes();

  return (
    <div className="panel-page">
      <PageHeader
        eyebrow="Reportes"
        title="Comparativas y desvíos"
        description="Cambios entre períodos y desvíos contra presupuesto."
        actions={(
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              className="input min-w-[220px]"
              value={selectedPeriod}
              onChange={(event) => setSelectedPeriod(event.target.value)}
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Presupuesto"
          value={isLoading ? '...' : formatCurrency(comparisonReport?.actual?.total_presupuestado)}
          detail={selectedPeriodLabel}
          trend={error ? 'Sin datos' : 'Objetivo del período'}
          icon={TrendingUp}
          tone="warning"
        />
        <StatCard
          title="Desvío total"
          value={isLoading ? '...' : formatCurrency(budgetGap)}
          detail={selectedPeriodLabel}
          trend={
            error
              ? 'Sin datos'
              : budgetGap > 0
                ? 'Por encima del presupuesto'
                : budgetGap < 0
                  ? 'Por debajo del presupuesto'
                  : 'En línea con el presupuesto'
          }
          icon={ArrowRightLeft}
          tone={budgetGapTone}
        />
        <StatCard
          title="Categoría líder"
          value={isLoading ? '...' : topCategory?.categoria_nombre || 'Sin datos'}
          detail={isLoading ? 'Cargando' : topCategory ? formatCurrency(topCategory.total_gastado) : 'Sin movimientos'}
          trend={error ? 'Sin datos' : topCategory ? `${Number(topCategory.participacion).toFixed(1)}% del gasto` : 'Sin datos'}
          icon={PieChartIcon}
          tone="success"
        />
      </div>

      {error ? (
        <SectionPanel>
          <p className="text-sm font-semibold text-[var(--danger)]">{error}</p>
        </SectionPanel>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <SectionPanel
          title="Comparativa contra el período anterior"
          description="Resumen del período elegido frente al anterior."
        >
          <div className="space-y-4">
            <div className="rounded-[24px] border border-[rgba(16,37,66,0.08)] bg-[rgba(22,58,112,0.04)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Actual</p>
              <p className="mt-2 text-2xl font-bold text-[var(--text)]">
                {isLoading ? '...' : formatCurrency(comparisonReport?.actual?.total_gastado)}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">{selectedPeriodLabel}</p>
            </div>

            <div className="rounded-[24px] border border-[rgba(16,37,66,0.08)] bg-[rgba(29,138,103,0.05)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Anterior</p>
              <p className="mt-2 text-2xl font-bold text-[var(--text)]">
                {isLoading ? '...' : formatCurrency(comparisonReport?.anterior?.total_gastado)}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {isLoading ? 'Cargando' : formatMonthYear(comparisonReport?.anterior?.anio, comparisonReport?.anterior?.mes)}
              </p>
            </div>

            <div className="rounded-[24px] border border-[rgba(16,37,66,0.08)] bg-white/75 p-4">
              <p className="text-sm font-semibold text-[var(--text)]">Lectura</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {isLoading
                  ? 'Calculando variación...'
                  : comparisonDelta > 0
                    ? `Subió ${formatCurrency(comparisonDelta)} vs el período anterior.`
                    : comparisonDelta < 0
                      ? `Bajó ${formatCurrency(Math.abs(comparisonDelta))} vs el período anterior.`
                      : 'Sin cambios contra el período anterior.'}
              </p>
              <p className="mt-2 text-xs font-semibold text-[var(--muted)]">
                {isLoading ? 'Cargando' : formatPercent(comparisonReport?.variacion_gastado_porcentual)}
              </p>
            </div>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Desvío contra presupuesto"
          description="Categorías sobre o bajo presupuesto."
        >
          <div className="h-[300px] sm:h-[320px]">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="w-full animate-pulse space-y-3">
                  <div className="h-5 w-40 rounded-full bg-[rgba(22,58,112,0.08)]" />
                  <div className="h-5 w-52 rounded-full bg-[rgba(22,58,112,0.08)]" />
                  <div className="h-5 w-32 rounded-full bg-[rgba(22,58,112,0.08)]" />
                  <div className="h-5 w-44 rounded-full bg-[rgba(22,58,112,0.08)]" />
                </div>
              </div>
            ) : categoryAnalysis.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryAnalysis} layout="vertical" margin={chartMargin}>
                  <CartesianGrid stroke="rgba(16,37,66,0.08)" horizontal={false} />
                  <XAxis type="number" tickFormatter={tooltipFormatter} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="categoria_nombre" axisLine={false} tickLine={false} width={92} />
                  <Tooltip formatter={tooltipFormatter} />
                  <Bar dataKey="diferencia" radius={[0, 12, 12, 0]}>
                    {categoryAnalysis.map((item, index) => (
                      <Cell
                        key={`${item.categoria_nombre}-${index}`}
                        fill={item.diferencia > 0 ? '#c85757' : '#1d8a67'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">Sin categorías para comparar.</div>
            )}
          </div>
        </SectionPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
        <SectionPanel
          title="Participación por categoría"
          description="Peso de cada categoría en el período."
        >
          <div className="space-y-3">
            {isLoading ? (
              <LoadingRows rows={4} />
            ) : categoryAnalysis.length ? (
              categoryAnalysis.map((item) => (
                <div key={item.categoria_nombre} className="rounded-2xl border border-[rgba(16,37,66,0.08)] bg-white/70 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[var(--text)]">{item.categoria_nombre}</p>
                    <p className="text-sm font-semibold text-[var(--text)]">{item.participacion.toFixed(1)}%</p>
                  </div>
                  <div className="mt-2 flex flex-col gap-1 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <span>{formatCurrency(item.total_gastado)}</span>
                    <span className="sm:text-right">
                      {item.uso_presupuesto === null ? 'Sin presupuesto' : `${Math.round(item.uso_presupuesto)}% del presupuesto`}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-[220px] items-center justify-center text-sm text-[var(--muted)]">Sin movimientos.</div>
            )}
          </div>
        </SectionPanel>

        <SectionPanel
          title="Categorías con mayor variación"
          description="Mayores cambios vs el período anterior."
        >
          <div className="h-[280px] sm:h-[300px]">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="w-full animate-pulse space-y-3">
                  <div className="h-5 w-44 rounded-full bg-[rgba(22,58,112,0.08)]" />
                  <div className="h-5 w-32 rounded-full bg-[rgba(22,58,112,0.08)]" />
                  <div className="h-5 w-48 rounded-full bg-[rgba(22,58,112,0.08)]" />
                  <div className="h-5 w-36 rounded-full bg-[rgba(22,58,112,0.08)]" />
                </div>
              </div>
            ) : comparisonCategories.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonCategories} layout="vertical" margin={chartMargin}>
                  <CartesianGrid stroke="rgba(16,37,66,0.08)" horizontal={false} />
                  <XAxis type="number" tickFormatter={tooltipFormatter} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="categoria_nombre" axisLine={false} tickLine={false} width={92} />
                  <Tooltip formatter={tooltipFormatter} />
                  <Bar dataKey="diferencia" radius={[0, 12, 12, 0]}>
                    {comparisonCategories.map((item, index) => (
                      <Cell
                        key={`${item.categoria_nombre}-${index}`}
                        fill={item.diferencia >= 0 ? '#c85757' : '#1d8a67'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">Sin historial suficiente.</div>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {comparisonCategories.slice(0, 4).map((item) => (
              <div key={item.categoria_nombre} className="flex flex-col gap-3 rounded-2xl border border-[rgba(16,37,66,0.08)] bg-white/72 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--text)]">{item.categoria_nombre}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {formatCurrency(item.actual)} ahora vs {formatCurrency(item.anterior)} antes
                  </p>
                </div>
                <div className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${item.diferencia >= 0 ? 'bg-[rgba(200,87,87,0.12)] text-[var(--danger)]' : 'bg-[rgba(29,138,103,0.12)] text-[var(--success)]'}`}>
                  {formatPercent(item.variacion_porcentual)}
                </div>
              </div>
            ))}
          </div>
        </SectionPanel>
      </div>
    </div>
  );
};

export default Reportes;
