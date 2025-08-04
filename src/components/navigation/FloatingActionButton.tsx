import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  label?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  disabled = false,
  className,
  icon,
  label = "Continue"
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 safe-bottom z-50">
      <div className="px-4 pb-4 pt-2 bg-gradient-to-t from-[rgb(var(--background))] via-[rgb(var(--background))] to-transparent">
        <Button
          onClick={onClick}
          disabled={disabled}
          size="lg"
          className={cn(
            "w-full",
            "bg-[rgb(var(--accent))] text-[rgb(var(--accent-foreground))]",
            "shadow-[var(--shadow-lg)]",
            "rounded-[var(--radius-xl)]",
            "font-semibold",
            "ios-button-press",
            "touch-44",
            className
          )}
        >
          <span>{label}</span>
          {icon || <ChevronRight className="w-5 h-5 ml-2" />}
        </Button>
      </div>
    </div>
  );
};