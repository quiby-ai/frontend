import React from 'react';
import { App } from '@/types';
import { cn } from '@/lib/utils';

interface AppCardProps {
  app: App;
  isSelected?: boolean;
  onClick: (app: App) => void;
  className?: string;
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  isSelected = false,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={() => onClick(app)}
      className={cn(
        "w-full text-left p-4 rounded-[var(--radius-xl)]",
        "bg-[rgb(var(--surface))] border border-[rgb(var(--secondary-600))]",
        "shadow-[var(--shadow-sm)]",
        "touch-44 touch-feedback card-interactive",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] focus:ring-offset-2",
        isSelected && [
          "bg-[rgb(var(--accent))] border-[rgb(var(--accent))]",
          "shadow-[var(--shadow-md)]",
          "text-[rgb(var(--accent-foreground))]"
        ],
        className
      )}
    >
      <div className="flex items-center gap-4 w-full">
        {/* App Icon */}
        <div className="relative">
          {app.icon ? (
            <img 
              src={app.icon} 
              alt={app.name}
              className="w-12 h-12 rounded-[var(--radius-lg)] flex-shrink-0 shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[rgb(var(--secondary-400))] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[rgb(var(--text-muted))]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          {/* Selection Indicator */}
          {isSelected && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-[rgb(var(--accent-foreground))] rounded-full flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-[rgb(var(--accent))]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        {/* App Details */}
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className={cn(
            "font-semibold text-base truncate ios-text",
            isSelected ? "text-[rgb(var(--accent-foreground))]" : "text-[rgb(var(--text-primary))]"
          )}>
            {app.name}
          </h3>
          
          <div className={cn(
            "text-sm flex items-center gap-2 ios-text",
            isSelected ? "text-[rgb(var(--accent-foreground))] opacity-90" : "text-[rgb(var(--text-secondary))]"
          )}>
            {app.developer && <span className="truncate">{app.developer}</span>}
            {app.category && app.developer && <span className="opacity-60">•</span>}
            {app.category && <span className="capitalize">{app.category}</span>}
          </div>
          
          {app.userRatingCount && (
            <div className={cn(
              "text-xs flex items-center gap-1 ios-text",
              isSelected ? "text-[rgb(var(--accent-foreground))] opacity-80" : "text-[rgb(var(--text-tertiary))]"
            )}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{app.userRatingCount.toLocaleString()} ratings</span>
            </div>
          )}
        </div>
        
        {/* Chevron Indicator */}
        <div className={cn(
          "flex-shrink-0 transition-transform",
          isSelected ? "text-[rgb(var(--accent-foreground))]" : "text-[rgb(var(--text-muted))]"
        )}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
};