import React from 'react';

const InfoBanner = ({ children, className = '' }) => {
  if (!children) {
    return null;
  }

  return (
    <div className={`rounded-3xl border border-[rgba(16,37,66,0.08)] bg-white/70 p-5 text-sm text-[var(--muted)] ${className}`.trim()}>
      {children}
    </div>
  );
};

export default InfoBanner;
