import React from 'react';
import { Button } from '@/components/ui/button';
import { App } from '@/types';

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
    <Button
      variant={isSelected ? "default" : "outline"}
      onClick={() => onClick(app)}
      className={`w-full justify-start h-auto p-4 text-left ${className || ''}`}
    >
      <div className="flex items-center gap-3 w-full">
        {app.icon && (
          <img 
            src={app.icon} 
            alt={app.name}
            className="w-8 h-8 rounded-lg flex-shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{app.name}</div>
          <div className="text-xs text-[hsl(var(--text-secondary))] mt-1 flex items-center gap-2">
            {app.developer && <span className="truncate">{app.developer}</span>}
            {app.category && app.developer && <span>•</span>}
            {app.category && <span>{app.category}</span>}
          </div>
          {app.userRatingCount && (
            <div className="text-xs text-[hsl(var(--text-muted))] mt-1">
              {app.userRatingCount.toLocaleString()} ratings
            </div>
          )}
        </div>
      </div>
    </Button>
  );
};