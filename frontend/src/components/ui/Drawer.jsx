import React from 'react';
import { X } from 'lucide-react';

const Drawer = ({ isOpen, onClose, eyebrow, title, description, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-[rgba(11,31,58,0.38)] backdrop-blur-sm">
      <div className="h-full w-full max-w-xl overflow-y-auto border-l border-[rgba(16,37,66,0.08)] bg-[linear-gradient(180deg,rgba(251,253,255,0.98),rgba(238,244,251,0.96))] shadow-[0_18px_60px_rgba(13,41,80,0.18)]">
        <div className="sticky top-0 z-10 border-b border-[rgba(16,37,66,0.08)] bg-white/85 px-5 py-4 backdrop-blur sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
              <h2 className="text-2xl font-bold text-[var(--text)]">{title}</h2>
              {description ? (
                <p className="text-sm text-[var(--muted)]">{description}</p>
              ) : null}
            </div>
            <button className="secondary-button px-3 py-2" onClick={onClose} type="button">
              <X className="h-4 w-4" />
              Cerrar
            </button>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
