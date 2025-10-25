import React from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      children,
      icon,
      iconPosition = 'right',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = clsx(
      'cursor-pointer flex items-center justify-center gap-2',
      'font-bold text-center transition-all duration-300 ease',
      'border-2 border-black rounded-md',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      !disabled && 'hover:shadow-none hover:translate-y-[3px] hover:translate-x-[3px]'
    );

    const variantStyles = {
      primary: 'bg-white text-black shadow-brutal',
      secondary: 'bg-black text-white shadow-brutal',
      ghost: 'bg-transparent text-black shadow-none border-none hover:bg-neutral-100',
      white: 'bg-white/10 backdrop-blur-sm text-white shadow-brutal-white border-white'
    };

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-lg px-6 py-3'
    };

    const fontFamily = variant === 'primary' || variant === 'secondary'
      ? 'font-[family-name:var(--font-montserrat)]'
      : '';

    return (
      <button
        ref={ref}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fontFamily,
          className
        )}
        disabled={disabled}
        {...props}
      >
        {icon && iconPosition === 'left' && <span className="transition-all duration-300">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="transition-all duration-300">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
