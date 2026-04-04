import React from 'react';
import { ArrowUpRight, Landmark, Plus, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionPanel from '../components/ui/SectionPanel';
import StatCard from '../components/ui/StatCard';
import { investmentPortfolio, monthlyExpenseSeries } from '../data/mockFinanceData';

const Inversiones = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cartera"
        title="Una vista más clara de cómo está distribuido tu capital"
        description="Reorganicé el módulo para que la lectura de asignación, retorno y riesgo sea directa incluso antes de conectar datos reales."
        actions={
          <>
            <button className="secondary-button">
              <ArrowUpRight className="h-4 w-4" />
              Ver estrategia
            </button>
            <button className="primary-button">
              <Plus className="h-4 w-4" />
              Nueva inversión
            </button>
          </>
        }
      />

      <div className="data-grid">
        <StatCard title="Capital total" value="$1.225.000" detail="Actualizado al cierre de abril" trend="+6,4% mensual" icon={Landmark} />
        <StatCard title="Instrumentos activos" value="4" detail="Balanceados entre renta fija y cobertura" trend="Diversificación estable" tone="success" />
        <StatCard title="Exposición de riesgo alto" value="22%" detail="Concentrada en Cedears Tech" trend="Dentro del rango objetivo" tone="warning" />
        <StatCard title="Protección cambiaria" value="18%" detail="Posición en dólar MEP" trend="Cobertura activa" icon={ShieldCheck} dark />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionPanel title="Asignación actual" description="Distribución simple para evaluar peso, retorno y riesgo de cada instrumento.">
          <div className="space-y-3">
            {investmentPortfolio.map((asset) => (
              <div key={asset.asset} className="rounded-3xl bg-[rgba(22,58,112,0.04)] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-[var(--text)]">{asset.asset}</p>
                    <p className="text-sm text-[var(--muted)]">Asignación {asset.allocation}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="pill">{asset.risk}</span>
                    <span className="rounded-full bg-[rgba(29,138,103,0.12)] px-3 py-1 text-xs font-semibold text-[var(--success)]">
                      {asset.return}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-2xl font-bold text-[var(--text)]">{asset.amount}</p>
              </div>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="Lectura estratégica" description="Estado resumido para decisiones de rebalanceo.">
          <div className="space-y-4">
            <div className="metric-card-dark">
              <p className="eyebrow !text-[#8fd0bc]">Recomendación</p>
              <p className="mt-3 text-2xl font-bold text-white">Mantener perfil moderado</p>
              <p className="mt-2 text-sm text-[#c3d4ea]">
                La cartera muestra cobertura adecuada en moneda dura y margen para sumar renta fija ajustada por inflación.
              </p>
            </div>
            <div className="section-card p-5">
              <p className="text-sm text-[var(--muted)]">Últimos 6 meses</p>
              <div className="mt-4 space-y-3">
                {monthlyExpenseSeries.map((item) => (
                  <div key={item.month} className="flex items-center gap-3">
                    <span className="w-8 text-sm font-semibold text-[var(--text)]">{item.month}</span>
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-[rgba(22,58,112,0.1)]">
                      <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${Math.min(item.inversiones / 700, 100)}%` }} />
                    </div>
                    <span className="text-sm text-[var(--muted)]">${item.inversiones.toLocaleString('es-AR')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionPanel>
      </div>
    </div>
  );
};

export default Inversiones;
