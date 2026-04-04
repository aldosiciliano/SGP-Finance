import React from 'react';
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
  CreditCard,
  DollarSign,
  PiggyBank
} from 'lucide-react';
import SectionPanel from '../components/ui/SectionPanel';
import StatCard from '../components/ui/StatCard';
import {
  expenseCategories,
  monthlyExpenseSeries,
  plannedExpenses,
  recentExpenses
} from '../data/mockFinanceData';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="data-grid">
        <StatCard
          title="Gasto acumulado"
          value="$125.430"
          detail="46 movimientos registrados"
          trend="-12% vs marzo"
          icon={DollarSign}
          tone="default"
        />
        <StatCard
          title="Presupuesto mensual"
          value="$175.000"
          detail="Quedan $49.570 disponibles"
          trend="Uso saludable"
          icon={CreditCard}
          tone="warning"
        />
        <StatCard
          title="Ahorro proyectado"
          value="$41.200"
          detail="Si mantenés este ritmo"
          trend="+18% respecto al objetivo"
          icon={PiggyBank}
          tone="success"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <SectionPanel
          title="Evolución mensual"
          description="Comparativa entre gasto real y presupuesto mensual."
        >
          <div className="h-[300px]">
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
                <Tooltip />
                <Area type="monotone" dataKey="presupuesto" stroke="#7a92b2" strokeWidth={2} fill="transparent" />
                <Area type="monotone" dataKey="gastos" stroke="#163a70" strokeWidth={3} fill="url(#gastosFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionPanel>

        <SectionPanel title="Distribución por categoría" description="Tus rubros más relevantes del período.">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="mx-auto h-[220px] w-full max-w-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={84}
                    paddingAngle={4}
                  >
                    {expenseCategories.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 space-y-3">
              {expenseCategories.map((category) => (
                <div key={category.name} className="flex items-center justify-between rounded-2xl bg-[rgba(22,58,112,0.04)] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="status-dot" style={{ backgroundColor: category.color }} />
                    <div>
                      <p className="font-semibold text-[var(--text)]">{category.name}</p>
                      <p className="text-xs text-[var(--muted)]">{category.value}% del mes</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-[var(--text)]">{category.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <SectionPanel
          title="Últimos movimientos"
          description="Lectura rápida de tus egresos recientes con contexto de categoría."
          action={<button className="secondary-button">Ver todos</button>}
        >
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div key={`${expense.merchant}-${expense.date}`} className="flex flex-col gap-3 rounded-3xl bg-[rgba(22,58,112,0.04)] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-[var(--text)]">{expense.merchant}</p>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
                    <span>{expense.category}</span>
                    <span className="h-1 w-1 rounded-full bg-[#b5c7db]" />
                    <span>{expense.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[var(--text)]">{expense.amount}</p>
                </div>
                <span className="pill">{expense.status}</span>
              </div>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="Compromisos próximos" description="Pagos y vencimientos priorizados para la próxima semana.">
          <div className="space-y-3">
            {plannedExpenses.map((expense) => (
              <div key={`${expense.category}-${expense.dueDate}`} className="rounded-3xl border border-[rgba(16,37,66,0.08)] bg-white/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--text)]">{expense.category}</p>
                    <p className="text-sm text-[var(--muted)]">Vence {expense.dueDate}</p>
                  </div>
                  <span className="pill">{expense.status}</span>
                </div>
                <p className="mt-4 text-lg font-bold text-[var(--text)]">{expense.amount}</p>
              </div>
            ))}
          </div>
        </SectionPanel>
      </div>
    </div>
  );
};

export default Dashboard;
