import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { FloatingActionButton } from '@/components/navigation/FloatingActionButton';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { SamplingMode, SamplingCriteria } from '@/types';
import { DateRange } from 'react-day-picker';
import { Calendar, Clock } from 'lucide-react';

interface SamplingCriteriaScreenProps {
  onNext: (criteria: SamplingCriteria) => void;
}

const QUICK_SELECT_OPTIONS = [
  { label: 'Last 7 days', days: 7, icon: '📅' },
  { label: 'Last 30 days', days: 30, icon: '🗓️' },
  { label: 'Last 90 days', days: 90, icon: '📆' },
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
      <div className="w-full space-y-8 animate-fade-in-up pb-24">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="relative">
            {/* <div className="absolute inset-0 bg-[rgb(var(--accent))] bg-opacity-5 rounded-full blur-2xl animate-pulse-ios" /> */}
            <SimpleMascot state="sampling" size="md" />
          </div>
          <p className="text-base text-[rgb(var(--text-secondary))] ios-text leading-relaxed max-w-xs mx-auto">
            Choose how to sample reviews
          </p>
        </div>

        {/* Mode Selection */}
        <div className="space-y-4">
          <h3 className="text-base font-medium text-[rgb(var(--text-primary))] ios-text">
            Sampling Method
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Date Range Option */}
            <button
              onClick={() => handleModeChange('dateRange')}
              className={`p-4 rounded-[var(--radius-xl)] border-2 transition-all duration-200 ease-out touch-44 touch-feedback ${
                mode === 'dateRange'
                  ? 'bg-[rgb(var(--accent))] border-[rgb(var(--accent))] text-[rgb(var(--accent-foreground))] shadow-[var(--shadow-lg)]'
                  : 'bg-[rgb(var(--surface))] border-[rgb(var(--secondary-600))] text-[rgb(var(--text-primary))] shadow-[var(--shadow-sm)]'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  mode === 'dateRange' ? 'bg-[rgb(var(--accent-foreground))]' : 'bg-[rgb(var(--accent))] bg-opacity-10'
                }`}>
                  <Calendar className={`w-5 h-5 ${mode === 'dateRange' ? 'text-[rgb(var(--accent))]' : 'text-[rgb(var(--accent))]'}`} />
                </div>
                <span className="text-sm font-medium ios-text">Date Range</span>
              </div>
            </button>

            {/* Version Option (Coming Soon) */}
            <button
              disabled
              className="p-4 rounded-[var(--radius-xl)] border-2 bg-[rgb(var(--surface-secondary))] border-[rgb(var(--secondary-600))] text-[rgb(var(--text-muted))] opacity-50 relative"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[rgb(var(--secondary-400))] bg-opacity-20 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v11H4V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium ios-text">App Version</span>
              </div>
              <div className="absolute -top-1 -right-1 bg-[rgb(var(--info))] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                Soon
              </div>
            </button>
          </div>
        </div>

        {/* Date Range Configuration */}
        {mode === 'dateRange' && (
          <div className="space-y-6 animate-fade-in-scale">
            {/* Quick Select Options */}
            <div className="space-y-4">
              <h4 className="text-base font-medium text-[rgb(var(--text-primary))] ios-text">
                Quick Select
              </h4>
              
              <div className="space-y-3">
                {QUICK_SELECT_OPTIONS.map((option, index) => (
                  <button
                    key={option.days}
                    onClick={() => handleQuickSelect(option.days)}
                    className="w-full p-4 rounded-[var(--radius-lg)] bg-[rgb(var(--surface))] border border-[rgb(var(--secondary-600))] shadow-[var(--shadow-sm)] touch-44 touch-feedback card-interactive animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[rgb(var(--accent))] bg-opacity-10 rounded-full flex items-center justify-center">
                        <span className="text-lg">{option.icon}</span>
                      </div>
                      <div className="text-left flex-1">
                        <span className="font-medium text-[rgb(var(--text-primary))] ios-text">{option.label}</span>
                      </div>
                      <Clock className="w-4 h-4 text-[rgb(var(--text-muted))]" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 h-px bg-[rgb(var(--secondary-500))]"></div>
              <span className="text-sm text-[rgb(var(--text-muted))] ios-text">or</span>
              <div className="flex-1 h-px bg-[rgb(var(--secondary-500))]"></div>
            </div>

            {/* Custom Date Range */}
            <div className="space-y-4">
              <h4 className="text-base font-medium text-[rgb(var(--text-primary))] ios-text">
                Custom Date Range
              </h4>
              
              <div className="p-4 bg-[rgb(var(--surface))] border border-[rgb(var(--secondary-600))] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
                <DateRangePicker
                  value={dateRange}
                  onValueChange={setDateRange}
                  placeholder="Select start and end dates"
                  className="w-full"
                />
              </div>
            </div>

            {/* Selection Summary */}
            {dateRange?.from && dateRange?.to && (
              <div className="p-4 bg-[rgb(var(--success-light))] border border-[rgb(var(--success))] border-opacity-20 rounded-[var(--radius-lg)] animate-fade-in-scale">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-5 h-5 text-[rgb(var(--success))]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-[rgb(var(--success))] ios-text">
                    Date Range Selected
                  </span>
                </div>
                <p className="text-sm text-[rgb(var(--success))] ios-text">
                  From {dateRange.from.toLocaleDateString()} to {dateRange.to.toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action */}
      {canStart() && (
        <FloatingActionButton 
          onClick={handleStartAnalysis} 
          label="Start Analysis"
        />
      )}
    </AppLayout>
  );
};