import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = [
    'inline-flex items-center justify-center',
    'font-semibold',
    'rounded-apple-lg',
    'transition-all duration-200',
    'tap-effect',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none',
  ].join(' ');

  const sizeStyles = {
    sm: 'px-4 py-2 text-[14px]',
    md: 'px-5 py-3 text-[16px]',
    lg: 'px-6 py-4 text-[17px]',
  };

  const variants = {
    primary: 'bg-accent-blue text-white hover:opacity-90 active:opacity-80',
    secondary: 'bg-fill-secondary text-label-primary hover:bg-fill-primary active:opacity-80',
    danger: 'bg-accent-red text-white hover:opacity-90 active:opacity-80',
    success: 'bg-accent-green text-white hover:opacity-90 active:opacity-80',
    ghost: 'bg-transparent text-accent-blue hover:bg-fill-tertiary active:opacity-70',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};