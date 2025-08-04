import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base iOS-style input styling
          'flex h-12 w-full rounded-[var(--radius-lg)]',
          'border border-[rgb(var(--secondary-600))]',
          'bg-[rgb(var(--surface))]',
          'px-4 py-3',
          'text-base ios-text',
          'shadow-[var(--shadow-sm)]',
          'transition-all duration-200 ease-out',
          
          // Typography and placeholders
          'placeholder:text-[rgb(var(--text-placeholder))]',
          'file:border-0 file:bg-transparent file:text-base file:font-medium',
          'file:text-[rgb(var(--text-primary))]',
          
          // Focus states
          'focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] focus:ring-offset-1',
          'focus:border-[rgb(var(--accent))]',
          'focus:shadow-[var(--shadow-md)]',
          
          // Disabled states
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[rgb(var(--surface-secondary))]',
          
          // iOS-specific behavior
          'touch-44',
          '-webkit-appearance-none appearance-none',
          
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
