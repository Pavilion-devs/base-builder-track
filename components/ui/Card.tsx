import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  noBorder?: boolean;
  variant?: 'default' | 'violet' | 'lime' | 'rose' | 'amber';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      hover = false,
      noBorder = false,
      variant = 'default',
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = clsx(
      'overflow-hidden',
      !noBorder && 'border-8 border-black rounded-[28px]'
    );

    const variantStyles = {
      default: 'bg-white',
      violet: 'bg-violet-100',
      lime: 'bg-lime-100',
      rose: 'bg-rose-100',
      amber: 'bg-amber-100'
    };

    const hoverStyles = hover
      ? 'transition-transform group-hover:translate-x-1 group-hover:translate-y-1 cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          hoverStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
