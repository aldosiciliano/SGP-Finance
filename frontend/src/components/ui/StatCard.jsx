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
    <article className={`${dark ? 'metric-card-dark' : 'metric-card'} min-w-0 overflow-hidden`}>
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className={`text-xs font-medium uppercase tracking-wide truncate leading-none ${dark ? 'text-[#c3d4ea]' : 'text-[var(--muted)]'}`}>
            {title}
          </p>
          <div>
            <p className={`text-sm font-bold truncate leading-none sm:text-base ${dark ? 'text-white' : 'text-[var(--text)]'}`}>
              {value}
            </p>
            {detail ? (
              <p className={`mt-1 text-xs truncate ${dark ? 'text-[#c3d4ea]' : 'text-[var(--muted)]'}`}>
                {detail}
              </p>
            ) : null}
          </div>
        </div>

        {Icon ? (
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${dark ? 'bg-white/10 text-white' : tones[tone]}`}>
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
      </div>

      {trend ? (
        <div className={`mt-2 inline-flex max-w-full rounded-full px-2 py-0.5 text-[10px] font-semibold truncate ${dark ? 'bg-white/10 text-[#eef5ff]' : tones[tone]}`}>
          {trend}
        </div>
      ) : null}
    </article>
  );
};

export default StatCard;
