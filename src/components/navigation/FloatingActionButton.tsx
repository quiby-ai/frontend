import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  disabled = false,
  className
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "fixed bottom-6 right-6 w-14 h-14 rounded-full",
        "bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))]",
        "hover:from-[hsl(var(--accent))] hover:to-[hsl(var(--primary))]",
        "shadow-lg hover:shadow-xl transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "z-50",
        className
      )}
    >
      <ChevronRight className="w-6 h-6" />
    </Button>
  );
};