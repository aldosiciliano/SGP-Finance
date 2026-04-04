import React from 'react';
import { ArrowRight, BarChart3, CalendarRange, FileText, LineChart, PieChart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import SectionPanel from '../components/ui/SectionPanel';

const reportBlocks = [
  {
    title: 'Tendencias mensuales',
    description: 'Lectura histórica de gasto real, presupuesto y desvíos por período.',
    icon: LineChart
  },
  {
    title: 'Categorías más pesadas',
    description: 'Ranking de rubros que concentran mayor parte del consumo y su evolución.',
    icon: PieChart
  },
  {
    title: 'Comparativas entre períodos',
    description: 'Vista para medir variación frente al mes anterior y detectar cambios de hábito.',
    icon: CalendarRange
  },
  {
    title: 'Hallazgos accionables',
    description: 'Insights y alertas simples para entender dónde conviene intervenir primero.',
    icon: Sparkles
  }
];

const Reportes = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reportes"
        title="Espacio de análisis y lectura histórica"
        description="El dashboard ya quedó enfocado en seguimiento diario. Esta sección concentra comparación, tendencias y análisis para evitar mezclar operaciones con lectura estratégica."
        actions={
          <Link className="secondary-button" to="/dashboard">
            Volver al panel
          </Link>
        }
      />

      <SectionPanel className="overflow-hidden p-0">
        <div className="relative grid gap-6 bg-[linear-gradient(135deg,rgba(245,248,253,0.96),rgba(227,236,248,0.98))] px-6 py-6 sm:px-8 sm:py-8 lg:grid-cols-[1.25fr_0.95fr]">
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[rgba(22,58,112,0.10)] blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[rgba(29,138,103,0.10)] blur-3xl" />

          <div className="relative space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(16,37,66,0.08)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--text)]">
              <FileText className="h-4 w-4 text-[var(--primary)]" />
              Propuesta UX/UI aplicada
            </div>

            <div className="space-y-3">
              <h2 className="max-w-2xl text-3xl font-bold text-[var(--text)] sm:text-4xl">
                Reportes deja de ser un “módulo cerrado” y pasa a ser un destino claro dentro del producto.
              </h2>
              <p className="max-w-xl text-sm text-[var(--muted)] sm:text-base">
                Aunque falte implementación analítica, esta pantalla ya comunica intención de producto, alcance funcional y próxima evolución. Eso mejora consistencia y evita pantallas muertas.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-[rgba(16,37,66,0.08)] bg-white/75 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">Dashboard</p>
                <p className="mt-2 text-lg font-bold text-[var(--text)]">Seguimiento operativo</p>
                <p className="mt-2 text-sm text-[var(--muted)]">Estado actual, movimientos recientes, distribución y presupuesto del mes.</p>
              </div>
              <div className="rounded-[24px] border border-[rgba(16,37,66,0.08)] bg-white/75 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Reportes</p>
                <p className="mt-2 text-lg font-bold text-[var(--text)]">Lectura analítica</p>
                <p className="mt-2 text-sm text-[var(--muted)]">Tendencias, comparativas, variaciones e interpretación histórica.</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-[30px] border border-[rgba(16,37,66,0.08)] bg-[linear-gradient(160deg,#102542_0%,#0a1a31_100%)] p-6 text-[#eef5ff] shadow-[0_24px_50px_rgba(13,41,80,0.16)]">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#d9e7f7]">
                <BarChart3 className="h-4 w-4" />
                Objetivo
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9fb6d3]">Siguiente etapa</span>
            </div>

            <h3 className="mt-5 text-2xl font-bold">Convertir datos sueltos en decisiones.</h3>
            <p className="mt-3 text-sm text-[#c3d4ea]">
              La propuesta UX/UI separa claramente la lectura de corto plazo del análisis profundo. Eso ordena navegación, reduce ruido y prepara mejor la evolución del módulo.
            </p>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                <p className="text-sm font-semibold">1. Tendencia mensual</p>
                <p className="mt-1 text-sm text-[#c3d4ea]">Serie histórica de gasto vs presupuesto.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                <p className="text-sm font-semibold">2. Comparación contra período anterior</p>
                <p className="mt-1 text-sm text-[#c3d4ea]">Cambios porcentuales y focos de desvío.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                <p className="text-sm font-semibold">3. Ranking de categorías</p>
                <p className="mt-1 text-sm text-[#c3d4ea]">Identificación rápida de rubros dominantes.</p>
              </div>
            </div>
          </div>
        </div>
      </SectionPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        {reportBlocks.map(({ title, description, icon: Icon }) => (
          <SectionPanel key={title}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(22,58,112,0.10)] text-[var(--primary)]">
                <Icon className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[var(--text)]">{title}</h3>
                <p className="text-sm text-[var(--muted)]">{description}</p>
              </div>
            </div>
          </SectionPanel>
        ))}
      </div>

      <SectionPanel
        title="Próximo entregable"
        description="Qué tendría que implementarse en backend y frontend para convertir esta propuesta en reportes funcionales."
      >
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-[24px] border border-[rgba(16,37,66,0.08)] bg-[rgba(22,58,112,0.03)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">Agregación por períodos</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Endpoint mensual para gasto, presupuesto y variación.</p>
          </div>
          <div className="rounded-[24px] border border-[rgba(16,37,66,0.08)] bg-[rgba(22,58,112,0.03)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">Comparativas</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Lectura contra mes anterior y ranking por categorías.</p>
          </div>
          <div className="rounded-[24px] border border-[rgba(16,37,66,0.08)] bg-[rgba(22,58,112,0.03)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">Narrativa visual</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Gráficos y métricas interpretables, no solo números aislados.</p>
          </div>
        </div>

        <div className="mt-5">
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]" to="/dashboard">
            Volver al dashboard operativo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </SectionPanel>
    </div>
  );
};

export default Reportes;
