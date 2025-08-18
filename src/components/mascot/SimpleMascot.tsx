import React from 'react';
import { MascotState } from '@/types';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

import mascotIcon from '@/assets/images/mascot-icon.png';
import mascotSearchIcon from '@/assets/images/mascot-search.png';
import mascotWorldIcon from '@/assets/images/mascot-world.png';
import mascotSamplingIcon from '@/assets/images/mascot-sampling.png';

import mascotFetchIcon from '@/assets/images/processing/mascot-fetch.png';
import mascotAnalyzeIcon from '@/assets/images/processing/mascot-analyze.png';
import mascotProcessIcon from '@/assets/images/processing/mascot-process.png';
import mascotGenerateIcon from '@/assets/images/processing/mascot-generate.png';

import mascotErrorIcon from '@/assets/images/mascot-error.png';
import mascotSuccessIcon from '@/assets/images/mascot-success.png';

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
            "loading-simple bg-accent from-[hsl(var(--primary))] to-[hsl(var(--accent))]",
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
          <img 
            src={mascotSuccessIcon} 
            alt="Quiby" 
            className={cn(
              sizeClasses[size], 
              "object-contain hover:scale-105 transition-transform duration-200 animate-heartbeat"
            )}
          />
        );
      
      case 'error':
        return (
          <img 
            src={mascotErrorIcon} 
            alt="Quiby" 
            className={cn(
              sizeClasses[size], 
              "object-contain hover:scale-105 transition-transform duration-200"
            )}
          />
        );

      case 'search':
        return (
          <img 
            src={mascotSearchIcon} 
            alt="Quiby" 
            className={cn(
              sizeClasses[size], 
              "object-contain hover:scale-105 transition-transform duration-200"
            )}
          />
        );
      
      case 'world':
        return (
          <img 
            src={mascotWorldIcon} 
            alt="Quiby" 
            className={cn(
              sizeClasses[size], 
              "object-contain hover:scale-105 transition-transform duration-200"
            )}
          />
        );

      case 'sampling':
        return (
          <img 
            src={mascotSamplingIcon} 
            alt="Quiby" 
            className={cn(
              sizeClasses[size], 
              "object-contain hover:scale-105 transition-transform duration-200"
            )}
          />
        );

      case 'processing.fetch':
        return (
          <img 
            src={mascotFetchIcon} 
            alt="Quiby" 
            className={cn(
              sizeClasses[size], 
              "object-contain hover:scale-105 transition-transform duration-200 animate-heartbeat"
            )}
          />
        );
      
      case 'processing.analyze':
        return (
          <img 
            src={mascotAnalyzeIcon} 
            alt="Quiby" 
            className={cn(
              sizeClasses[size], 
              "object-contain hover:scale-105 transition-transform duration-200 animate-heartbeat"
            )}
          />
        );

      case 'processing.process':
        return (
          <img 
            src={mascotProcessIcon} 
            alt="Quiby" 
            className={cn(
              sizeClasses[size], 
              "object-contain hover:scale-105 transition-transform duration-200 animate-heartbeat"
            )}
          />
        );

      case 'processing.generate':
        return (
          <img 
            src={mascotGenerateIcon} 
            alt="Quiby" 
            className={cn(
              sizeClasses[size], 
              "object-contain hover:scale-105 transition-transform duration-200 animate-heartbeat"
            )}
          />
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