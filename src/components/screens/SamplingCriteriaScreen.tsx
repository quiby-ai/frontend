import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { FloatingActionButton } from '@/components/navigation/FloatingActionButton';
import { SamplingMode, SamplingCriteria, App } from '@/types';
import { DateRange } from 'react-day-picker';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { startAnalysis } from '@/services/api';

interface SamplingCriteriaScreenProps {
  selectedApp?: App;
  selectedCountries: string[];
  onNext: (criteria: SamplingCriteria, sagaId: string) => void;
}

const QUICK_SELECT_OPTIONS = [
  { label: 'Last 7 days', days: 7, icon: '📅' },
  { label: 'Last 30 days', days: 30, icon: '🗓️' },
  { label: 'Last 90 days', days: 90, icon: '📆' },
];

export const SamplingCriteriaScreen: React.FC<SamplingCriteriaScreenProps> = ({
  selectedApp,
  selectedCountries,
  onNext
}) => {
  const [mode, setMode] = useState<SamplingMode>('dateRange');
  const [versions, setVersions] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

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

  const validateForm = (): string | null => {
    // Check if app is selected
    if (!selectedApp) {
      return 'Please select an app first';
    }

    // Check if countries are selected
    if (selectedCountries.length === 0) {
      return 'Please select at least one country';
    }

    // Check sampling criteria based on mode
    if (mode === 'version') {
      if (versions.length === 0) {
        return 'Please select at least one app version';
      }
    } else if (mode === 'dateRange') {
      if (!dateRange?.from || !dateRange?.to) {
        return 'Please select a date range';
      }
      if (dateRange.from > dateRange.to) {
        return 'Start date must be before end date';
      }
    }

    return null;
  };

  const canStart = () => {
    return validateForm() === null;
  };

  const handleStartAnalysis = async () => {
    try {
      // Clear previous errors
      setValidationError(null);

      // Validate form
      const error = validateForm();
      if (error) {
        setValidationError(error);
        return;
      }

      setIsLoading(true);

      // Prepare sampling criteria
      const criteria: SamplingCriteria = {
        mode,
        ...(mode === 'version' ? { versions } : {}),
        ...(mode === 'dateRange' && dateRange?.from && dateRange?.to ? {
          dateFrom: dateRange.from.toISOString().split('T')[0],
          dateTo: dateRange.to.toISOString().split('T')[0]
        } : {})
      };

      // Helper function to ensure YYYY-MM-DD format with local timezone
      const formatDateToYYYYMMDD = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // Make API request
      const response = await startAnalysis({
        app_id: selectedApp!.id,
        app_name: selectedApp!.name,
        countries: selectedCountries,
        date_from: dateRange?.from ? formatDateToYYYYMMDD(dateRange.from) : '',
        date_to: dateRange?.to ? formatDateToYYYYMMDD(dateRange.to) : ''
      });

      console.log('Analysis started successfully:', response);
      
      // Proceed to next step with criteria and saga_id
      onNext(criteria, response.saga_id);
    } catch (error) {
      console.error('Failed to start analysis:', error);
      
      let errorMessage = 'Failed to start analysis. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('401')) {
          errorMessage = 'Authentication expired. Please log in again.';
        } else if (error.message.includes('403')) {
          errorMessage = 'Access denied. Please check your permissions.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setValidationError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="w-full space-y-8 animate-fade-in-up pb-24">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="relative">
            <SimpleMascot state="sampling" size="md" />
          </div>
          <p className="text-base text-[rgb(var(--text-secondary))] ios-text leading-relaxed max-w-xs mx-auto">
            Choose how to sample reviews
          </p>
        </div>

        {/* Missing Selection Warning */}
        {(!selectedApp || selectedCountries.length === 0) && (
          <div className="p-4 bg-[rgb(var(--warning-light))] border border-[rgb(var(--warning))] border-opacity-20 rounded-[var(--radius-lg)] animate-fade-in-scale">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[rgb(var(--warning))]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-[rgb(var(--warning))] ios-text">
                {!selectedApp && selectedCountries.length === 0 && 'Please select an app and countries first'}
                {!selectedApp && selectedCountries.length > 0 && 'Please select an app first'}
                {selectedApp && selectedCountries.length === 0 && 'Please select countries first'}
              </div>
            </div>
          </div>
        )}

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
                  <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                    <path d="M7 2C5.9 2 5 2.9 5 4v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H7zm0 2h10v12H7V4zm0 14h10v2H7v-2z"/>
                    <circle cx="12" cy="19" r="1"/>
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

        {/* Analysis Summary */}
        {/* {selectedApp && selectedCountries.length > 0 && (
          <div className="p-4 bg-[rgb(var(--info-light))] border border-[rgb(var(--info))] border-opacity-20 rounded-[var(--radius-lg)] animate-fade-in-scale">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-[rgb(var(--info))]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-[rgb(var(--info))] ios-text">
                Analysis Summary
              </span>
            </div>
            <div className="space-y-2 text-sm text-[rgb(var(--info))] ios-text">
              <p><strong>App:</strong> {selectedApp.name}</p>
              <p><strong>Countries:</strong> {selectedCountries.length === 1 ? selectedCountries[0] : `${selectedCountries.length} countries selected`}</p>
              <p><strong>Mode:</strong> {mode === 'dateRange' ? 'Date Range' : 'App Version'}</p>
              {mode === 'dateRange' && dateRange?.from && dateRange?.to && (
                <p><strong>Period:</strong> {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}</p>
              )}
            </div>
          </div>
        )} */}

        {/* Validation Error Display */}
        {validationError && (
          <div className="p-4 bg-[rgb(var(--destructive-light))] border border-[rgb(var(--destructive))] border-opacity-20 rounded-[var(--radius-lg)] animate-fade-in-scale">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[rgb(var(--destructive))] mt-0.5" />
              <div className="flex-1">
                <span className="text-sm text-[rgb(var(--destructive))] ios-text">
                  {validationError}
                </span>
                {validationError.includes('Network error') && (
                  <button
                    onClick={handleStartAnalysis}
                    disabled={isLoading}
                    className="mt-2 text-xs text-[rgb(var(--destructive))] underline hover:no-underline disabled:opacity-50"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      {canStart() && (
        <FloatingActionButton 
          onClick={handleStartAnalysis} 
          label="Start Analysis"
          loading={isLoading}
          disabled={isLoading}
        />
      )}
    </AppLayout>
  );
};
