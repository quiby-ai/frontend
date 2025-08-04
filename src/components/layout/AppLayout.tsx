import React from 'react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;
  rightAction?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  className,
  showBackButton = false,
  onBack,
  title,
  rightAction
}) => {
  return (
    <div className={cn(
      "min-h-screen min-h-[100svh] w-full flex flex-col",
      "bg-gradient-to-br from-[rgb(var(--background))] to-[rgb(var(--surface-tertiary))]",
      "relative overflow-hidden",
      className
    )}>
      {/* iOS-style Status Bar Spacer */}
      <div className="safe-top" />
      
      {/* iOS-style Navigation Header */}
      {(showBackButton || title || rightAction) && (
        <div className="flex items-center justify-between px-4 py-3 bg-[rgb(var(--surface))] bg-opacity-80 backdrop-blur-md border-b border-[rgb(var(--secondary-600))] border-opacity-20">
          <div className="w-16 flex justify-start">
            {showBackButton && (
              <button
                onClick={onBack}
                className="flex items-center justify-center w-8 h-8 rounded-full touch-44 touch-feedback"
                aria-label="Go back"
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="text-[rgb(var(--accent))]"
                >
                  <path 
                    d="M15 18L9 12L15 6" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
          
          {title && (
            <h1 className="text-lg font-semibold text-[rgb(var(--text-primary))] text-center flex-1 ios-text">
              {title}
            </h1>
          )}
          
          <div className="w-16 flex justify-end">
            {rightAction}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col",
        "px-4 py-6",
        "max-w-md mx-auto w-full",
        "screen-enter"
      )}>
        <div className="flex-1 flex flex-col justify-center space-y-6">
          {children}
        </div>
      </div>

      {/* iOS-style Home Indicator Spacer */}
      <div className="safe-bottom" />
    </div>
  );
};