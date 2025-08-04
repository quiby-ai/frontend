import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <AppLayout className="bg-gradient-to-br from-[rgb(var(--background))] via-[rgb(var(--surface))] to-[rgb(var(--accent-300))] bg-opacity-5">
      <div className="flex flex-col items-center text-center space-y-8 animate-fade-in-up">
        {/* Hero Mascot */}
        <div className="relative">
          {/* <div className="absolute inset-0 bg-[rgb(var(--accent))] bg-opacity-10 rounded-full blur-3xl animate-pulse-ios" /> */}
          <SimpleMascot state="idle" size="lg" />
        </div>
        
        {/* Hero Content */}
        <div className="space-y-6 max-w-sm">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-[rgb(var(--text-primary))] ios-text">
              Welcome to
              <span className="text-[rgb(var(--accent))] block">Quiby</span>
            </h1>
            <p className="text-lg text-[rgb(var(--text-secondary))] leading-relaxed ios-text">
              Analyze app reviews with AI-powered insights across multiple countries
            </p>
          </div>

          {/* Feature Points */}
          {/* <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 bg-[rgb(var(--accent))] bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-[rgb(var(--accent))]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-[rgb(var(--text-secondary))] ios-text">Multi-country analysis</span>
            </div>
            
            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 bg-[rgb(var(--accent))] bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-[rgb(var(--accent))]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-[rgb(var(--text-secondary))] ios-text">AI-powered insights</span>
            </div>
            
            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 bg-[rgb(var(--accent))] bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-[rgb(var(--accent))]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-[rgb(var(--text-secondary))] ios-text">Real-time processing</span>
            </div>
          </div> */}
        </div>

        {/* CTA Button */}
        <div className="pt-4 w-full max-w-sm">
          <Button 
            onClick={onStart}
            size="lg"
            className="w-full font-semibold"
          >
            Get Started
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};