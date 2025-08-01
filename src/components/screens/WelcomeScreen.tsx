import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <SimpleMascot state="idle" size="lg" />
        
        <div className="space-y-4">
          <h1 className="text-xl font-medium text-[hsl(var(--text-primary))]">
            Welcome to Quiby
          </h1>
          <p className="text-base text-[hsl(var(--text-secondary))] max-w-sm">
            Analyze app reviews with AI-powered insights across multiple countries
          </p>
        </div>

        <Button 
          onClick={onStart}
          size="lg"
        >
          Get Started
        </Button>
      </div>
    </AppLayout>
  );
};