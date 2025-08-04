import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { Progress } from '@/components/ui/progress';

const PROCESSING_STEPS = [
  { 
    message: "Fetching app reviews...", 
    icon: "📱",
    description: "Collecting reviews from app stores"
  },
  { 
    message: "Analyzing sentiment patterns...", 
    icon: "🔍",
    description: "Understanding user emotions and feedback"
  },
  { 
    message: "Processing user feedback...", 
    icon: "⚡",
    description: "Categorizing and organizing insights"
  },
  { 
    message: "Generating insights...", 
    icon: "🧠",
    description: "Creating actionable recommendations"
  },
  { 
    message: "Finalizing results...", 
    icon: "✨",
    description: "Preparing your comprehensive report"
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
            <SimpleMascot state="loading" size="lg" />
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

          {/* Processing Steps */}
          {/* <div className="space-y-3">
            <h3 className="text-base font-medium text-[rgb(var(--text-primary))] ios-text text-left">
              Processing Steps
            </h3>
            
            <div className="space-y-2">
              {PROCESSING_STEPS.map((step, index) => {
                const isCompleted = completedSteps.includes(index);
                const isCurrent = currentStepIndex === index;
                
                return (
                  <div 
                    key={index}
                    className={`p-3 rounded-[var(--radius-lg)] border transition-all duration-300 ease-out ${
                      isCompleted 
                        ? 'bg-[rgb(var(--success-light))] border-[rgb(var(--success))] border-opacity-20' 
                        : isCurrent
                        ? 'bg-[rgb(var(--accent-300))] bg-opacity-10 border-[rgb(var(--accent))] border-opacity-30'
                        : 'bg-[rgb(var(--surface-secondary))] border-[rgb(var(--secondary-600))]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-[rgb(var(--success))]' 
                          : isCurrent
                          ? 'bg-[rgb(var(--accent))]'
                          : 'bg-[rgb(var(--secondary-400))]'
                      }`}>
                        {isCompleted ? (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : isCurrent ? (
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                        ) : (
                          <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full" />
                        )}
                      </div>
                      
                      <span className={`text-sm font-medium ios-text ${
                        isCompleted 
                          ? 'text-[rgb(var(--success))]' 
                          : isCurrent
                          ? 'text-[rgb(var(--accent))]'
                          : 'text-[rgb(var(--text-muted))]'
                      }`}>
                        {step.message}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div> */}
        </div>

        {/* Estimated Time */}
        {/* <div className="p-4 bg-[rgb(var(--info-light))] border border-[rgb(var(--info))] border-opacity-20 rounded-[var(--radius-lg)]">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[rgb(var(--info))] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-[rgb(var(--info))] ios-text">
              <strong>Estimated time:</strong> 2-3 minutes for comprehensive analysis
            </p>
          </div>
        </div> */}
      </div>
    </AppLayout>
  );
};