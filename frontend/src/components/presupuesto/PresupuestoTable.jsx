import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const PresupuestoTable = ({
  categoriesById,
  formatCurrency,
  handleDelete,
  isDeletingId,
  monthLabel,
  onEdit,
  presupuestos,
  resumenByCategoriaId
}) => {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[rgba(16,37,66,0.08)]">
      <div className="hidden grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1fr] gap-4 bg-[rgba(22,58,112,0.06)] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)] lg:grid">
        <span>Categoría</span>
        <span className="text-right">Presupuesto</span>
        <span className="text-right">Gastado</span>
        <span className="text-right">Restante</span>
        <span className="text-right">Acciones</span>
      </div>

      <div className="divide-y divide-[rgba(16,37,66,0.08)] bg-white/70">
        {presupuestos.map((presupuesto) => {
          const resumenCategoria = resumenByCategoriaId[presupuesto.categoria_id];

          return (
            <div key={presupuesto.id} className="grid gap-3 px-5 py-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1fr] lg:items-center">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-2xl border border-[rgba(16,37,66,0.08)]"
                  style={{ backgroundColor: `${categoriesById[presupuesto.categoria_id]?.color || '#163a70'}22` }}
                />
                <div>
                  <p className="font-semibold text-[var(--text)]">
                    {categoriesById[presupuesto.categoria_id]?.nombre || `Categoría #${presupuesto.categoria_id}`}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    {monthLabel(presupuesto.mes, presupuesto.anio)}
                  </p>
                </div>
              </div>
              <p className="text-right text-sm font-semibold text-[var(--text)]">
                {formatCurrency(presupuesto.monto)}
              </p>
              <p className="text-right text-sm font-semibold text-[var(--text)]">
                {formatCurrency(resumenCategoria?.gastado)}
              </p>
              <p className={`text-right text-sm font-semibold ${Number(resumenCategoria?.restante || 0) < 0 ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}>
                {formatCurrency(resumenCategoria?.restante)}
              </p>
              <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
                <button className="secondary-button px-3 py-2" onClick={() => onEdit(presupuesto)} type="button">
                  <Pencil className="h-4 w-4" />
                  Editar
                </button>
                <button
                  className="secondary-button px-3 py-2 text-[var(--danger)]"
                  disabled={isDeletingId === presupuesto.id}
                  onClick={() => handleDelete(presupuesto)}
                  type="button"
                >
                  <Trash2 className="h-4 w-4" />
                  {isDeletingId === presupuesto.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PresupuestoTable;
