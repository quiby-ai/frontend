import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium ios-button-press touch-44 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 ios-text transition-all duration-150 ease-out',
  {
    variants: {
      variant: {
        default:
          'bg-[rgb(var(--accent))] text-[rgb(var(--accent-foreground))] shadow-[var(--shadow-md)] hover:bg-[rgb(var(--accent-600))] active:bg-[rgb(var(--accent-600))] rounded-[var(--radius-lg)]',
        primary:
          'bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] shadow-[var(--shadow-md)] hover:bg-[rgb(var(--primary-600))] active:bg-[rgb(var(--primary-600))] rounded-[var(--radius-lg)]',
        secondary:
          'bg-[rgb(var(--surface))] text-[rgb(var(--text-primary))] border border-[rgb(var(--secondary-500))] shadow-[var(--shadow-sm)] hover:bg-[rgb(var(--surface-secondary))] active:bg-[rgb(var(--surface-secondary))] rounded-[var(--radius-lg)]',
        destructive:
          'bg-[rgb(var(--error))] text-white shadow-[var(--shadow-md)] hover:opacity-90 active:opacity-90 rounded-[var(--radius-lg)]',
        outline:
          'border-2 border-[rgb(var(--accent))] bg-transparent text-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))] hover:text-[rgb(var(--accent-foreground))] active:bg-[rgb(var(--accent))] active:text-[rgb(var(--accent-foreground))] rounded-[var(--radius-lg)]',
        ghost: 
          'bg-transparent text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--surface-secondary))] active:bg-[rgb(var(--surface-secondary))] rounded-[var(--radius-lg)]',
        link: 
          'text-[rgb(var(--accent))] underline-offset-4 hover:underline bg-transparent p-0 h-auto rounded-none',
      },
      size: {
        sm: 'h-9 px-4 text-sm min-w-[80px]',
        default: 'h-12 px-6 text-base min-w-[120px]',
        lg: 'h-14 px-8 text-lg min-w-[140px]',
        xl: 'h-16 px-10 text-xl min-w-[160px]',
        icon: 'h-12 w-12 p-0',
        'icon-sm': 'h-9 w-9 p-0',
        'icon-lg': 'h-14 w-14 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
