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
          <h1 className="text-xl font-bold text-[hsl(var(--text-primary))]">
            Welcome to Quiby
          </h1>
          <p className="text-base text-[hsl(var(--text-secondary))] max-w-sm">
            Analyze app reviews with AI-powered insights across multiple countries
          </p>
        </div>

        <Button 
          onClick={onStart}
          size="lg"
          className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] hover:from-[hsl(var(--accent))] hover:to-[hsl(var(--primary))] text-white px-8"
        >
          Get Started
        </Button>
      </div>
    </AppLayout>
  );
};