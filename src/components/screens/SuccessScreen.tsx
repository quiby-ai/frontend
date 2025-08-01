import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProcessingResults } from '@/types';

interface SuccessScreenProps {
  results: ProcessingResults;
  onViewResults: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ 
  results, 
  onViewResults 
}) => {
  return (
    <AppLayout>
      <div className="w-full space-y-6 text-center">
        <SimpleMascot state="success" size="lg" />
        
        <div className="space-y-4">
          <h1 className="text-lg font-semibold text-[hsl(var(--text-primary))]">
            Analysis Complete!
          </h1>
          
          <Card className="p-6 bg-[hsl(var(--surface))] border-[hsl(var(--surface))]">
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-medium text-[hsl(var(--success))]">
                  {results.reviewCount.toLocaleString()}
                </div>
                <div className="text-sm text-[hsl(var(--text-secondary))]">
                  reviews analyzed for {results.app.name}
                </div>
              </div>
              
              <div className="text-xs text-[hsl(var(--text-muted))]">
                {results.countries.includes('worldwide') 
                  ? 'Worldwide analysis' 
                  : `${results.countries.length} countries`
                } • {results.tokenLimit.toLocaleString()} tokens used
              </div>
            </div>
          </Card>
        </div>

        <Button 
          onClick={onViewResults}
          size="lg"
          className="w-full bg-gradient-to-r from-[hsl(var(--success))] to-[hsl(var(--primary))] hover:from-[hsl(var(--primary))] hover:to-[hsl(var(--success))]"
        >
          View Detailed Results
        </Button>
      </div>
    </AppLayout>
  );
};