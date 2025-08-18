import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Progress } from '@/components/ui/progress';
import { SimpleMascot } from '../mascot/SimpleMascot';
import { MascotState } from '@/types';
import { useWebSocket } from '@/hooks/useWebSocket';
import { WebSocketMessage, ProcessingStatus, ProcessingStepInfo } from '@/types';
import { getWebSocketUrl } from '@/config/websocket';

const PROCESSING_STEPS: ProcessingStepInfo[] = [
  { 
    step: 'extract',
    status: 'running',
    message: "Fetching app reviews...", 
    icon: "📱",
    description: "Collecting reviews from app stores",
    image: 'processing.fetch',
    isActive: false,
    isCompleted: false,
    isFailed: false
  },
  { 
    step: 'prepare',
    status: 'running',
    message: "Preparing insights...", 
    icon: "🧹",
    description: "Processing and analyzing review data",
    image: 'processing.process',
    isActive: false,
    isCompleted: false,
    isFailed: false
  }
];

interface ProcessingScreenProps {
  selectedApp?: { name: string };
  onProcessingComplete?: () => void;
  onProcessingError?: (error: string) => void;
}

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ 
  selectedApp, 
  onProcessingComplete,
  onProcessingError 
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStepInfo[]>(PROCESSING_STEPS);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);

  // WebSocket connection for real-time updates
  const { isConnected } = useWebSocket({
    url: getWebSocketUrl(),
    onMessage: handleWebSocketMessage,
    onError: handleWebSocketError,
  });

  function handleWebSocketMessage(message: WebSocketMessage) {
    console.log('WebSocket message received:', message);
    
    const { step, status, context } = message;
    
    setProcessingSteps(prevSteps => {
      return prevSteps.map(stepInfo => {
        if (stepInfo.step === step) {
          const updatedStep: ProcessingStepInfo = {
            ...stepInfo,
            status: status as ProcessingStatus,
            message: context.message || stepInfo.message,
            isActive: status === 'running',
            isCompleted: status === 'completed',
            isFailed: status === 'failed'
          };
          
          // Update progress based on step completion
          if (status === 'completed') {
            const completedSteps = prevSteps.filter(s => s.isCompleted).length;
            const totalSteps = prevSteps.length;
            const newProgress = ((completedSteps + 1) / totalSteps) * 100;
            setProgress(newProgress);
          }
          
          return updatedStep;
        }
        return stepInfo;
      });
    });

    // Check if processing is complete
    if (step === 'prepare' && status === 'completed') {
      setIsProcessingComplete(true);
      setProgress(100);
      onProcessingComplete?.();
    }

    // Handle failures
    if (status === 'failed') {
      onProcessingError?.(`Processing failed at step: ${step}`);
    }
  }

  function handleWebSocketError(error: Event) {
    console.error('WebSocket error:', error);
    onProcessingError?.('Connection error occurred');
  }

  // Update current step based on active processing steps
  useEffect(() => {
    const activeStepIndex = processingSteps.findIndex(step => step.isActive);
    if (activeStepIndex !== -1) {
      setCurrentStepIndex(activeStepIndex);
    }
  }, [processingSteps]);

  // Fallback progress animation if WebSocket is not connected
  useEffect(() => {
    if (!isConnected && !isProcessingComplete) {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return 90; // Don't go to 100% without WebSocket confirmation
          const increment = Math.random() * 2 + 1;
          return Math.min(prev + increment, 90);
        });
      }, 150);

      return () => clearInterval(progressInterval);
    }
  }, [isConnected, isProcessingComplete]);

  const currentStep = processingSteps[currentStepIndex];

  return (
    <AppLayout 
      className="bg-gradient-to-br from-[rgb(var(--background))] via-[rgb(var(--surface))] to-[rgb(var(--accent-300))] bg-opacity-5"
    >
      <div className="w-full space-y-8 text-center animate-fade-in-up">
        {/* Connection Status */}
        {!isConnected && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-600 text-sm">
              Connecting to processing server...
            </p>
          </div>
        )}

        {/* Hero Section */}
        <div className="space-y-6">
          <div className="relative">
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

          {/* Processing Steps */}
          <div className="space-y-4">
            {processingSteps.map((step) => (
              <div 
                key={step.step}
                className={`p-6 bg-[rgb(var(--surface))] border rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] transition-all duration-300 ${
                  step.isActive 
                    ? 'border-[rgb(var(--accent))] bg-[rgb(var(--accent))] bg-opacity-5' 
                    : step.isCompleted 
                    ? 'border-green-500 bg-green-500 bg-opacity-5'
                    : step.isFailed
                    ? 'border-red-500 bg-red-500 bg-opacity-5'
                    : 'border-[rgb(var(--secondary-600))]'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step.isCompleted 
                        ? 'bg-green-500 text-white' 
                        : step.isFailed
                        ? 'bg-red-500 text-white'
                        : step.isActive
                        ? 'bg-[rgb(var(--accent))] text-white animate-breathe'
                        : 'bg-[rgb(var(--secondary-400))] text-[rgb(var(--text-secondary))]'
                    }`}>
                      {step.isCompleted ? (
                        <span className="text-2xl">✅</span>
                      ) : step.isFailed ? (
                        <span className="text-2xl">❌</span>
                      ) : (
                        <span className="text-2xl">📱</span>
                      )}
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-semibold text-[rgb(var(--text-primary))] ios-text">
                        {step.message}
                      </h3>
                      <p className="text-sm text-[rgb(var(--text-secondary))] ios-text mt-1">
                        {step.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {step.isActive && !step.isCompleted && !step.isFailed && (
                        <div className="w-6 h-6 border-2 border-[rgb(var(--accent))] border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};