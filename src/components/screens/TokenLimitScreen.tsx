import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

interface TokenLimitScreenProps {
  tokenLimit: number;
  onSetTokenLimit: (limit: number) => void;
  onNext: () => void;
}

export const TokenLimitScreen: React.FC<TokenLimitScreenProps> = ({
  tokenLimit,
  onSetTokenLimit,
  onNext
}) => {
  const [currentLimit, setCurrentLimit] = useState(tokenLimit || 1000);

  const handleSliderChange = (value: number[]) => {
    setCurrentLimit(value[0]);
    onSetTokenLimit(value[0]);
  };

  const getEstimatedCost = (tokens: number) => {
    return (tokens * 0.002).toFixed(2);
  };

  const getEstimatedReviews = (tokens: number) => {
    return Math.floor(tokens / 10);
  };

  return (
    <AppLayout>
      <div className="w-full space-y-6">
        <div className="text-center space-y-4">
          <SimpleMascot state="idle" size="md" />
          <h1 className="text-lg font-semibold text-[hsl(var(--text-primary))]">
            Set Token Limit
          </h1>
        </div>

        <Card className="p-6 bg-[hsl(var(--surface))] border-[hsl(var(--surface))]">
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[hsl(var(--primary))]">
                {currentLimit.toLocaleString()}
              </div>
              <div className="text-sm text-[hsl(var(--text-secondary))]">
                tokens
              </div>
            </div>

            <Slider
              value={[currentLimit]}
              onValueChange={handleSliderChange}
              max={10000}
              min={100}
              step={50}
              className="w-full"
            />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-sm text-[hsl(var(--text-secondary))]">
                  Est. Reviews
                </div>
                <div className="font-semibold text-[hsl(var(--text-primary))]">
                  ~{getEstimatedReviews(currentLimit)}
                </div>
              </div>
              <div>
                <div className="text-sm text-[hsl(var(--text-secondary))]">
                  Est. Cost
                </div>
                <div className="font-semibold text-[hsl(var(--text-primary))]">
                  ${getEstimatedCost(currentLimit)}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Button 
          onClick={onNext}
          size="lg"
          className="w-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] hover:from-[hsl(var(--accent))] hover:to-[hsl(var(--primary))]"
        >
          Start Analysis
        </Button>
      </div>
    </AppLayout>
  );
};