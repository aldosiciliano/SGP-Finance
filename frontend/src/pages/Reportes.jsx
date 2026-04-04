import React from 'react';
import { Download, FileSpreadsheet, Sparkles } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionPanel from '../components/ui/SectionPanel';
import { reportHighlights } from '../data/mockFinanceData';

const Reportes = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Análisis"
        title="Reportes pensados para detectar patrones, no solo listar datos"
        description="La vista ahora prioriza hallazgos, resumen ejecutivo y salidas rápidas para exportación futura."
        actions={
          <>
            <button className="secondary-button">
              <FileSpreadsheet className="h-4 w-4" />
              Generar hoja
            </button>
            <button className="primary-button">
              <Download className="h-4 w-4" />
              Exportar PDF
            </button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {reportHighlights.map((highlight) => (
          <SectionPanel key={highlight.label} className="h-full" title={highlight.label}>
            <p className="text-3xl font-bold text-[var(--text)]">{highlight.value}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{highlight.detail}</p>
          </SectionPanel>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionPanel
          title="Resumen ejecutivo"
          description="Una narrativa de alto nivel para entender desempeño, desvíos y oportunidades."
        >
          <div className="space-y-4 text-sm leading-7 text-[var(--text)]/80">
            <p>
              Abril cerró con una mejora en el control general del gasto. La presión sobre el presupuesto cayó
              respecto de marzo y el ahorro potencial volvió a ubicarse por encima del objetivo mínimo.
            </p>
            <p>
              El principal foco de atención sigue estando en consumo variable, especialmente ocio y compras no
              planificadas. En contraste, servicios y pagos automáticos se mantienen previsibles.
            </p>
            <p>
              La interfaz ahora deja espacio para incorporar más adelante exportes, cortes temporales y segmentación
              por método de pago sin rehacer la estructura visual.
            </p>
          </div>
        </SectionPanel>

        <SectionPanel title="Próximos upgrades visuales" description="Espacios ya preparados para crecimiento funcional.">
          <div className="space-y-3">
            {[
              'Comparativas por período con selector mensual y anual.',
              'Exportación con presets: ejecutivo, contable y personal.',
              'Alertas sobre desvíos presupuestarios con umbrales visuales.',
              'Segmentación por medio de pago y moneda.'
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl bg-[rgba(22,58,112,0.04)] p-4">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-2xl bg-[rgba(29,138,103,0.1)] text-[var(--accent)]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-sm text-[var(--text)]/80">{item}</p>
              </div>
            ))}
          </div>
        </SectionPanel>
      </div>
    </div>
  );
};

export default Reportes;
