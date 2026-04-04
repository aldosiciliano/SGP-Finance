import React from 'react';
import { FileText, Lock } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionPanel from '../components/ui/SectionPanel';

const Reportes = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analisis"
        title="Seccion cerrada temporalmente"
        description="El modulo de reportes todavia no esta habilitado."
      />

      <SectionPanel className="overflow-hidden">
        <div className="relative rounded-[28px] border border-[rgba(16,37,66,0.08)] bg-[linear-gradient(135deg,rgba(22,58,112,0.06),rgba(245,158,11,0.10))] p-8 sm:p-10">
          <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-[rgba(245,158,11,0.14)] blur-2xl" />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--surface)] text-[var(--warning)] shadow-[0_16px_40px_rgba(22,58,112,0.08)]">
              <Lock className="h-8 w-8" />
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[rgba(22,58,112,0.08)] px-4 py-2 text-sm font-semibold text-[var(--text)]">
              <FileText className="h-4 w-4" />
              Reportes
            </div>

            <h2 className="mt-5 text-3xl font-bold text-[var(--text)]">
              Proximamente. En desarrollo.
            </h2>
            <p className="mt-3 max-w-xl text-base text-[var(--muted)]">
              Esta seccion va a quedar disponible mas adelante, cuando terminemos la etapa actual de implementacion.
            </p>
          </div>
        </div>
      </SectionPanel>
    </div>
  );
};

export default Reportes;
