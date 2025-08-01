import React from 'react';
import { MascotState } from '@/types';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import mascotIcon from '@/assets/images/mascot-icon.png';

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
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48'
  };

  const iconSizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-18 h-18',
    lg: 'w-24 h-24'
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
            "loading-simple bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))]",
            "border-2 border-[hsl(var(--primary)/0.4)]"
          )}>
            <Loader2 className={cn(
              iconSizeClasses[size], 
              "text-white animate-spin relative z-10 drop-shadow-lg"
            )} />
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
          <img 
            src={mascotIcon} 
            alt="Quiby" 
            className={cn(
              sizeClasses[size], 
              "object-contain hover:scale-105 transition-transform duration-200"
            )}
          />
        );
    }
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {renderMascot()}
    </div>
  );
};