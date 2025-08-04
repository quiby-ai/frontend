import React from 'react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  className
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