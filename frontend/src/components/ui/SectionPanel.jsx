import React from 'react';

const SectionPanel = ({ title, description, action, children, className = '' }) => {
  return (
    <section className={`section-card p-5 sm:p-6 ${className}`.trim()}>
      {(title || description || action) && (
        <div className="mb-4 flex flex-col gap-3 border-b border-[rgba(16,37,66,0.08)] pb-4 sm:mb-5 sm:pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            {title ? <h2 className="text-lg font-bold text-[var(--text)] sm:text-xl">{title}</h2> : null}
            {description ? <p className="max-w-2xl text-sm text-[var(--muted)]">{description}</p> : null}
          </div>
          {action ? <div className="flex shrink-0">{action}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
};

export default SectionPanel;
