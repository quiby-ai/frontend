import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SamplingMode, SamplingCriteria } from '@/types';
import { DateRange } from 'react-day-picker';

interface SamplingCriteriaScreenProps {
  onNext: (criteria: SamplingCriteria) => void;
}

const QUICK_SELECT_OPTIONS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];

export const SamplingCriteriaScreen: React.FC<SamplingCriteriaScreenProps> = ({
  onNext
}) => {
  const [mode, setMode] = useState<SamplingMode>('dateRange');
  const [versions, setVersions] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  


  // Handle mode changes - clear other mode's state and errors
  const handleModeChange = (newMode: SamplingMode) => {
    // Prevent switching to version mode (disabled for now)
    if (newMode === 'version') {
      return;
    }
    
    // Only allow dateRange mode for now
    if (newMode === 'dateRange') {
      setMode(newMode);
      
      // Clear version state since we're in date range mode
      setVersions([]);
    }
  };

  const handleQuickSelect = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    setDateRange({ from: startDate, to: endDate });
  };

  const canStart = () => {
    if (mode === 'version') {
      return versions.length > 0;
    }
    if (mode === 'dateRange') {
      return dateRange?.from && dateRange?.to && dateRange.from <= dateRange.to;
    }
    return false;
  };

  const handleStartAnalysis = () => {
    const criteria: SamplingCriteria = {
      mode,
      ...(mode === 'version' ? { versions } : {}),
      ...(mode === 'dateRange' && dateRange?.from && dateRange?.to ? {
        dateFrom: dateRange.from.toISOString().split('T')[0],
        dateTo: dateRange.to.toISOString().split('T')[0]
      } : {})
    };
    onNext(criteria);
  };

  return (
    <AppLayout>
      <div className="w-full space-y-6">
        <div className="text-center space-y-4">
          <SimpleMascot state="idle" size="md" />
          <h1 className="text-lg font-semibold text-[hsl(var(--text-primary))]">
            Choose Sampling
          </h1>
        </div>

        <Card className="p-6 bg-[hsl(var(--surface))] border-[hsl(var(--surface))] rounded-2xl shadow-sm">
          <Tabs value={mode} onValueChange={(value) => handleModeChange(value as SamplingMode)}>
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-2 bg-[hsl(var(--secondary))] h-12 p-1.5 rounded-xl">
              <TabsTrigger 
                value="dateRange"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 touch-manipulation"
              >
                Date Range
              </TabsTrigger>
              <TabsTrigger 
                value="version" 
                disabled
                className="opacity-50 cursor-not-allowed rounded-lg font-medium text-muted-foreground flex items-center gap-2 justify-center"
              >
                App Version 
                <Badge 
                  variant="secondary" 
                  className="text-xs px-2 py-0.5 rounded-full font-bold bg-[hsl(var(--info)/0.2)] border border-[hsl(var(--text-secondary))] text-[hsl(var(--text-primary))]"
                >
                  soon
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Date Range Mode Content */}
            <TabsContent value="dateRange" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-[hsl(var(--text-primary))]">
                    Quick Select
                  </Label>
                  <Select onValueChange={(value) => handleQuickSelect(parseInt(value))}>
                    <SelectTrigger className="h-12 rounded-xl border-2 transition-all duration-200 hover:border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 active:scale-[0.98] touch-manipulation">
                      <SelectValue 
                        placeholder="Choose a time period..." 
                        className="font-medium"
                      />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 shadow-lg">
                      {QUICK_SELECT_OPTIONS.map((option) => (
                        <SelectItem 
                          key={option.days} 
                          value={option.days.toString()}
                          className="h-11 rounded-lg font-medium transition-colors duration-150 focus:bg-primary/10 hover:bg-primary/5"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-[hsl(var(--text-primary))]">
                    Date Range
                  </Label>
                  <DateRangePicker
                    value={dateRange}
                    onValueChange={setDateRange}
                    placeholder="Select start and end dates"
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Version Mode Content (disabled) */}
            <TabsContent value="version" className="space-y-4 mt-6">
              <div className="space-y-3">
                <div className="text-center py-8 text-[hsl(var(--text-secondary))]">
                  <p className="text-sm">App Version sampling coming soon!</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Start Analysis Button */}
        <Button
          onClick={handleStartAnalysis}
          disabled={!canStart()}
          size="lg"
          className="w-full h-14 rounded-xl font-semibold text-lg bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] hover:from-[hsl(var(--accent))] hover:to-[hsl(var(--primary))] transition-all duration-200 active:scale-[0.98] touch-manipulation shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Analysis
        </Button>
      </div>
    </AppLayout>
  );
};