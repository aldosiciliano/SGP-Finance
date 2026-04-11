import React from 'react';

const AlertBanner = ({ children, className = '' }) => {
  if (!children) {
    return null;
  }

  return (
    <div className={`rounded-3xl border border-[rgba(200,87,87,0.18)] bg-[rgba(200,87,87,0.08)] p-4 text-sm text-[var(--danger)] ${className}`.trim()}>
      {children}
    </div>
  );
};

export default AlertBanner;
