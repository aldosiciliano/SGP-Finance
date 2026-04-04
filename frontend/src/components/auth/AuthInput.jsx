import React from 'react';

const AuthInput = ({ icon: Icon, className = '', trailing, ...props }) => {
  return (
    <div className="input-shell">
      {Icon ? (
        <span className="input-icon">
          <Icon />
        </span>
      ) : null}
      <input
        className={`input ${Icon ? 'input-with-icon' : ''} ${trailing ? 'pr-12' : ''} ${className}`.trim()}
        {...props}
      />
      {trailing}
    </div>
  );
};

export default AuthInput;
