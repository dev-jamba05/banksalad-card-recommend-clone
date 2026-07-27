'use client';

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, name, required, className = '', ...rest }, ref) => {
    const inputId = id ?? name;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          required={required}
          className={`
            w-full px-4 py-2.5 rounded-xl border text-sm outline-none
            transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error
              ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-200'
              : 'border-[color:var(--border-color)] bg-[color:var(--input-bg)] focus:border-primary focus:ring-2 focus:ring-[#00ba7130]'
            }
            ${className}
          `}
          style={{ color: 'var(--text-main)' }}
          {...rest}
        />

        {error && (
          <p className="flex items-center gap-1 text-xs text-red-500" role="alert">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p className="text-xs" style={{ color: 'var(--text-sub)' }}>{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
