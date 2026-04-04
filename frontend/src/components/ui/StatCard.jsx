import React from 'react';

const StatCard = ({
  title,
  value,
  detail,
  trend,
  icon: Icon,
  tone = 'default',
  dark = false
}) => {
  const tones = {
    default: 'bg-[rgba(22,58,112,0.1)] text-[var(--primary)]',
    success: 'bg-[rgba(29,138,103,0.12)] text-[var(--success)]',
    warning: 'bg-[rgba(84,140,255,0.12)] text-[var(--primary)]',
    danger: 'bg-[rgba(200,87,87,0.12)] text-[var(--danger)]'
  };

  return (
    <article className={dark ? 'metric-card-dark' : 'metric-card'}>
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0 space-y-2">
          <p className={`text-xs font-semibold uppercase tracking-[0.18em] sm:text-sm sm:normal-case sm:tracking-normal ${dark ? 'text-[#c3d4ea]' : 'text-[var(--muted)]'}`}>{title}</p>
          <div>
            <p className={`text-2xl font-bold sm:text-3xl ${dark ? 'text-white' : 'text-[var(--text)]'}`}>{value}</p>
            {detail ? (
              <p className={`mt-1 text-xs sm:text-sm ${dark ? 'text-[#c3d4ea]' : 'text-[var(--muted)]'}`}>{detail}</p>
            ) : null}
          </div>
        </div>

        {Icon ? (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12 ${dark ? 'bg-white/10 text-white' : tones[tone]}`}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        ) : null}
      </div>

      {trend ? (
        <div className={`mt-4 inline-flex max-w-full rounded-full px-3 py-1 text-[11px] font-semibold sm:mt-5 sm:text-xs ${dark ? 'bg-white/10 text-[#eef5ff]' : tones[tone]}`}>
          {trend}
        </div>
      ) : null}
    </article>
  );
};

export default StatCard;
