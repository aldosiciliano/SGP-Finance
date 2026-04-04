import React from 'react';

const SectionPanel = ({ title, description, action, children, className = '' }) => {
  return (
    <section className={`section-card p-5 sm:p-6 ${className}`.trim()}>
      {(title || description || action) && (
        <div className="mb-5 flex flex-col gap-3 border-b border-[rgba(16,37,66,0.08)] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            {title ? <h2 className="text-xl font-bold text-[var(--text)]">{title}</h2> : null}
            {description ? <p className="text-sm text-[var(--muted)]">{description}</p> : null}
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
};

export default SectionPanel;
