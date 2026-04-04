import React from 'react';

const PageHeader = ({ eyebrow, title, description, actions, align = 'left' }) => {
  return (
    <div
      className={[
        'flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between',
        align === 'center' ? 'text-center lg:text-left' : ''
      ].join(' ')}
    >
      <div className="max-w-2xl space-y-3">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="section-title text-balance">{title}</h1>
        {description ? <p className="section-copy">{description}</p> : null}
      </div>

      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
};

export default PageHeader;
