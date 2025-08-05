import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Progress } from '@/components/ui/progress';
import { SimpleMascot } from '../mascot/SimpleMascot';
import { MascotState } from '@/types';

const PROCESSING_STEPS = [
  { 
    message: "Fetching app reviews...", 
    icon: "📱",
    description: "Collecting reviews from app stores",
    image: 'processing.fetch'
  },
  { 
    message: "Analyzing sentiment patterns...", 
    icon: "🔍",
    description: "Understanding user emotions and feedback",
    image: 'processing.analyze'
  },
  { 
    message: "Processing user feedback...", 
    icon: "⚡",
    description: "Categorizing and organizing insights",
    image: 'processing.process'
  },
  { 
    message: "Generating insights...", 
    icon: "🧠",
    description: "Creating actionable recommendations",
    image: 'processing.generate'
  },
  { 
    message: "Finalizing results...", 
    icon: "✨",
    description: "Preparing your comprehensive report",
    image: 'processing.process'
  }
];

interface ProcessingScreenProps {
  selectedApp?: { name: string };
}

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ selectedApp }) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        const increment = Math.random() * 2 + 1; // Slower, more realistic progress
        return Math.min(prev + increment, 100);
      });
    }, 150);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => (prev + 1) % PROCESSING_STEPS.length);
    }, 2000); // Slower step transitions for better UX

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  const currentStep = PROCESSING_STEPS[currentStepIndex];

  return (
    <AppLayout 
      className="bg-gradient-to-br from-[rgb(var(--background))] via-[rgb(var(--surface))] to-[rgb(var(--accent-300))] bg-opacity-5"
    >
      <div className="w-full space-y-8 text-center animate-fade-in-up">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="relative">
            {/* <div className="absolute inset-0 bg-[rgb(var(--accent))] bg-opacity-10 rounded-full blur-3xl animate-pulse-ios" /> */}
            <SimpleMascot state={currentStep.image as MascotState} size="lg" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))] ios-text">
              Analyzing
            </h1>
            <h2 className="text-xl font-semibold text-[rgb(var(--accent))] ios-text">
              {selectedApp?.name}
            </h2>
            <p className="text-base text-[rgb(var(--text-secondary))] ios-text max-w-xs mx-auto leading-relaxed">
              We're processing your app's reviews to generate insights
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="p-6 bg-[rgb(var(--surface))] border border-[rgb(var(--secondary-600))] rounded-[var(--radius-xl)] shadow-[var(--shadow-md)]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[rgb(var(--text-primary))] ios-text">
                  Overall Progress
                </span>
                <span className="text-sm font-semibold text-[rgb(var(--accent))] ios-text">
                  {Math.round(progress)}%
                </span>
              </div>
              
              <div className="relative">
                <Progress 
                  value={progress} 
                  className="w-full h-3 rounded-full bg-[rgb(var(--secondary-400))] bg-opacity-20" 
                />
                <div 
                  className="absolute top-0 left-0 h-3 bg-gradient-to-r from-[rgb(var(--accent))] to-[rgb(var(--accent-400))] rounded-full transition-all duration-300 ease-out shadow-sm"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Current Step */}
          <div className="p-6 bg-[rgb(var(--surface))] border border-[rgb(var(--secondary-600))] rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] animate-fade-in-scale">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[rgb(var(--accent))] bg-opacity-10 rounded-full flex items-center justify-center animate-breathe">
                  <span className="text-2xl">{currentStep.icon}</span>
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-[rgb(var(--text-primary))] ios-text">
                    {currentStep.message}
                  </h3>
                  <p className="text-sm text-[rgb(var(--text-secondary))] ios-text mt-1">
                    {currentStep.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 border-2 border-[rgb(var(--accent))] border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};