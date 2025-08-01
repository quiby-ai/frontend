import React from 'react';
import { MascotState } from '@/types';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle, XCircle, Circle } from 'lucide-react';

interface SimpleMascotProps {
  state: MascotState;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SimpleMascot: React.FC<SimpleMascotProps> = ({ 
  state, 
  size = 'lg',
  className 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const renderMascot = () => {
    const baseClasses = cn(
      "rounded-full flex items-center justify-center transition-all duration-300",
      sizeClasses[size]
    );

    switch (state) {
      case 'loading':
        return (
          <div className={cn(
            baseClasses,
            "bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))]",
            "animate-pulse-glow"
          )}>
            <Loader2 className={cn(iconSizeClasses[size], "text-white animate-spin")} />
          </div>
        );
      
      case 'success':
        return (
          <div className={cn(
            baseClasses,
            "bg-gradient-to-br from-[hsl(var(--success))] to-[hsl(var(--success))]",
            "animate-bounce-gentle"
          )}>
            <CheckCircle className={cn(iconSizeClasses[size], "text-white")} />
          </div>
        );
      
      case 'error':
        return (
          <div className={cn(
            baseClasses,
            "bg-gradient-to-br from-[hsl(var(--error))] to-[hsl(var(--error))]",
            "animate-pulse"
          )}>
            <XCircle className={cn(iconSizeClasses[size], "text-white")} />
          </div>
        );
      
      default: // idle
        return (
          <div className={cn(
            baseClasses,
            "bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))]",
            "hover:scale-105 transition-transform duration-200"
          )}>
            <Circle className={cn(iconSizeClasses[size], "text-white")} />
          </div>
        );
    }
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {renderMascot()}
    </div>
  );
};