import React from 'react';
import { Filter, Plus, Search, SlidersHorizontal } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionPanel from '../components/ui/SectionPanel';
import StatCard from '../components/ui/StatCard';
import { expensesBoard } from '../data/mockFinanceData';

const Gastos = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Gestión de gastos"
        title="Registrá, filtrá y entendé mejor tus egresos"
        description="Convertí la vista de gastos en un espacio operativo: resumen rápido, búsqueda y una tabla que ordena mejor lo importante."
        actions={
          <>
            <button className="secondary-button">
              <Filter className="h-4 w-4" />
              Filtros avanzados
            </button>
            <button className="primary-button">
              <Plus className="h-4 w-4" />
              Nuevo gasto
            </button>
          </>
        }
      />

      <div className="data-grid">
        <StatCard title="Total del mes" value="$125.430" detail="46 operaciones registradas" trend="+4 nuevas hoy" />
        <StatCard title="Ticket promedio" value="$11.740" detail="Concentrado en 5 rubros" trend="Menor dispersión" tone="warning" />
        <StatCard title="Pagos automáticos" value="8" detail="17% del total mensual" trend="2 vencen esta semana" tone="success" />
        <StatCard title="Alertas activas" value="3" detail="Riesgo de excedente en ocio" trend="Revisar hoy" tone="danger" />
      </div>

      <SectionPanel
        title="Tablero operativo"
        description="Una capa visual más ordenada para revisar movimientos, método de pago y contexto sin entrar a detalle."
      >
        <div className="mb-5 grid gap-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <label className="input-shell">
            <Search />
            <input className="input input-with-icon" placeholder="Buscar comercio, nota o rubro" />
          </label>
          <select className="input">
            <option>Todos los rubros</option>
            <option>Alimentos</option>
            <option>Servicios</option>
            <option>Transporte</option>
            <option>Ocio</option>
          </select>
          <button className="secondary-button h-full">
            <SlidersHorizontal className="h-4 w-4" />
            Ordenar por fecha
          </button>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-[rgba(16,37,66,0.08)]">
          <div className="hidden grid-cols-[1.4fr_0.9fr_0.9fr_0.7fr_0.9fr] gap-4 bg-[rgba(22,58,112,0.06)] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)] lg:grid">
            <span>Movimiento</span>
            <span>Categoría</span>
            <span>Pago</span>
            <span>Fecha</span>
            <span className="text-right">Monto</span>
          </div>

          <div className="divide-y divide-[rgba(16,37,66,0.08)] bg-white/70">
            {expensesBoard.map((expense) => (
              <div key={`${expense.item}-${expense.date}`} className="grid gap-3 px-5 py-4 lg:grid-cols-[1.4fr_0.9fr_0.9fr_0.7fr_0.9fr] lg:items-center">
                <div>
                  <p className="font-semibold text-[var(--text)]">{expense.item}</p>
                  <p className="text-sm text-[var(--muted)]">{expense.note}</p>
                </div>
                <p className="text-sm text-[var(--text)]">{expense.category}</p>
                <p className="text-sm text-[var(--text)]">{expense.paymentMethod}</p>
                <p className="text-sm text-[var(--muted)]">{expense.date}</p>
                <p className="text-right text-sm font-semibold text-[var(--text)]">{expense.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionPanel>
    </div>
  );
};

export default Gastos;
