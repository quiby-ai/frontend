import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ErrorScreenProps {
  error: Error;
  onRetry: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onRetry }) => {
  return (
    <AppLayout>
      <div className="w-full space-y-6 text-center">
        <SimpleMascot state="error" size="lg" />
        
        <div className="space-y-4">
          <h1 className="text-lg font-semibold text-[hsl(var(--text-primary))]">
            Something went wrong
          </h1>
          
          <Card className="p-6 bg-[hsl(var(--surface))] border-[hsl(var(--surface))]">
            <p className="text-sm text-[hsl(var(--text-secondary))]">
              {error.message || "We encountered an unexpected error while processing your request."}
            </p>
          </Card>
        </div>

        <Button 
          onClick={onRetry}
          size="lg"
          className="w-full bg-gradient-to-r from-[hsl(var(--error))] to-[hsl(var(--primary))] hover:from-[hsl(var(--primary))] hover:to-[hsl(var(--error))]"
        >
          Try Again
        </Button>
      </div>
    </AppLayout>
  );
};