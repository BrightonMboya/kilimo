'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '~/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'black';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const baseStyles = 'font-semibold rounded-lg transition-all duration-300 hover:cursor-pointer whitespace-nowrap cursor-expand';
    
    const variants = {
      primary: 'bg-green-700 text-white border-2 border-green-900 hover:bg-green-500 hover:border-green-600',
      secondary: 'bg-white text-green-700 hover:bg-white/50 hover:text-black',
      ghost: 'backdrop-blur-sm bg-white/10 text-white border-2 border-white hover:bg-white/20',
      black: 'bg-black text-white', // removed rounded and font-medium, baseStyles handles both
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        // style={{ borderRadius: '8px' }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
