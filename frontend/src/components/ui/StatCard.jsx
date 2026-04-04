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
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className={`text-sm ${dark ? 'text-[#c3d4ea]' : 'text-[var(--muted)]'}`}>{title}</p>
          <div>
            <p className={`text-3xl font-bold ${dark ? 'text-white' : 'text-[var(--text)]'}`}>{value}</p>
            {detail ? (
              <p className={`mt-1 text-sm ${dark ? 'text-[#c3d4ea]' : 'text-[var(--muted)]'}`}>{detail}</p>
            ) : null}
          </div>
        </div>

        {Icon ? (
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${dark ? 'bg-white/10 text-white' : tones[tone]}`}>
            <Icon className="h-6 w-6" />
          </div>
        ) : null}
      </div>

      {trend ? (
        <div className={`mt-5 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${dark ? 'bg-white/10 text-[#eef5ff]' : tones[tone]}`}>
          {trend}
        </div>
      ) : null}
    </article>
  );
};

export default StatCard;
