import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Progress } from '@/components/ui/progress';
import { SimpleMascot } from '../mascot/SimpleMascot';

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
  sagaId?: string;
  onProcessingComplete?: () => void;
  onProcessingError?: (error: string) => void;
}

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ 
  selectedApp, 
  sagaId,
  onProcessingComplete,
  onProcessingError 
}) => {
  const [progress, setProgress] = useState(0);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStepInfo[]>(PROCESSING_STEPS);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [showConnectionError, setShowConnectionError] = useState(false);

  // WebSocket connection for real-time updates
  const { 
    isConnected, 
    connectionError
  } = useWebSocket({
    url: sagaId ? `${getWebSocketUrl()}?saga_id=${sagaId}` : getWebSocketUrl(),
    onMessage: handleWebSocketMessage,
    onError: handleWebSocketError,
    onClose: handleWebSocketClose,
  });

  // Show connection error after a delay if still not connected
  useEffect(() => {
    if (!isConnected && connectionError) {
      const timer = setTimeout(() => {
        setShowConnectionError(true);
      }, 3000); // Show error after 3 seconds
      
      return () => clearTimeout(timer);
    } else {
      setShowConnectionError(false);
    }
  }, [isConnected, connectionError]);

  // Cleanup WebSocket when sagaId changes or component unmounts
  useEffect(() => {
    return () => {
      // This will be handled by the useWebSocket hook cleanup
      console.log('ProcessingScreen unmounting, WebSocket will be cleaned up');
    };
  }, [sagaId]);

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
    
    // Don't immediately show error to user - let the WebSocket service handle reconnection
    // Only show error if we're completely disconnected after multiple attempts
  }

  // Handle WebSocket close events
  function handleWebSocketClose() {
    console.log('WebSocket connection closed');
    // Don't immediately show error - let the service handle reconnection
  }

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

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full text-center">
          <SimpleMascot 
            state={isConnected ? "search" : "error"} 
            size="md"
            className="mx-auto mb-6"
          />
          
          {showConnectionError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700 text-sm mb-2">
                Unable to connect to processing server. This may be due to authentication issues.
              </p>
            </div>
          )}

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isConnected ? 'Analyzing' : 'Connecting...'}
          </h1>
          
          <p className="text-gray-600 mb-4">
            {selectedApp?.name || 'App'}
          </p>
          
          <p className="text-gray-500 text-sm mb-6">
            {isConnected 
              ? "We're processing your app's reviews to generate insights."
              : "Connecting to processing server..."
            }
          </p>

          {/* Connection Status */}
          <div className={`mb-6 p-3 rounded-lg text-sm ${
            isConnected 
              ? 'bg-green-100 border border-green-300 text-green-700'
              : connectionError
              ? 'bg-red-100 border border-red-300 text-red-700'
              : 'bg-yellow-100 border border-yellow-300 text-yellow-700'
          }`}>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : connectionError ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              <span>
                {isConnected 
                  ? 'Connected to processing server'
                  : connectionError
                  ? 'Connection failed - retrying...'
                  : 'Attempting to connect...'
                }
              </span>
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
      </div>
    </AppLayout>
  );
};