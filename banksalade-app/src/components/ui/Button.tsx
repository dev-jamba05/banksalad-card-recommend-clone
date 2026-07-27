'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:   'bg-primary text-white hover:opacity-90 focus:ring-2 focus:ring-offset-2 shadow-sm',
  secondary: 'bg-[#e6f7ef] text-[#00804e] hover:bg-[#d0f0e2]',
  outline:   'border-2 border-primary text-primary hover:bg-[#e6f7ef]',
  ghost:     'text-[color:var(--text-sub)] hover:bg-[color:var(--item-hover)]',
  danger:    'bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-offset-2 focus:ring-red-400 shadow-sm',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-colors duration-150 outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
}
