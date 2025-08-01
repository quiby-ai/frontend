import React from 'react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "min-h-screen w-full flex flex-col",
      "bg-background",
      className
    )}>
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full">
        {children}
      </div>
    </div>
  );
};