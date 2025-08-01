import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { Progress } from '@/components/ui/progress';

const PROCESSING_MESSAGES = [
  "Fetching app reviews...",
  "Analyzing sentiment patterns...",
  "Processing user feedback...",
  "Generating insights...",
  "Finalizing results..."
];

interface ProcessingScreenProps {
  selectedApp?: { name: string };
}

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ selectedApp }) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(PROCESSING_MESSAGES[0]);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 3;
      });
    }, 100);

    const messageInterval = setInterval(() => {
      setMessageIndex(prev => {
        const nextIndex = (prev + 1) % PROCESSING_MESSAGES.length;
        setCurrentMessage(PROCESSING_MESSAGES[nextIndex]);
        return nextIndex;
      });
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <AppLayout>
      <div className="w-full space-y-8 text-center">
        <SimpleMascot state="loading" size="lg" />
        
        <div className="space-y-4">
          <h1 className="text-lg font-semibold text-[hsl(var(--text-primary))]">
            Analyzing {selectedApp?.name}
          </h1>
          
          <div className="space-y-3">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-[hsl(var(--text-secondary))]">
              {currentMessage}
            </p>
          </div>
        </div>

        <div className="text-xs text-[hsl(var(--text-muted))]">
          This may take a few moments...
        </div>
      </div>
    </AppLayout>
  );
};