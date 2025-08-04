import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorScreenProps {
  error: Error;
  onRetry: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onRetry }) => {
  const getErrorInfo = (error: Error) => {
    const message = error.message || "We encountered an unexpected error while processing your request.";
    
    // Categorize common error types
    if (message.includes('network') || message.includes('connection')) {
      return {
        type: 'Network Error',
        icon: '🌐',
        description: 'Please check your internet connection and try again.',
        suggestion: 'Make sure you have a stable internet connection.'
      };
    } else if (message.includes('timeout')) {
      return {
        type: 'Request Timeout',
        icon: '⏱️',
        description: 'The request took too long to complete.',
        suggestion: 'The server might be busy. Please try again in a moment.'
      };
    } else if (message.includes('auth')) {
      return {
        type: 'Authentication Error',
        icon: '🔐',
        description: 'There was an issue with your authentication.',
        suggestion: 'Please restart the app from Telegram.'
      };
    } else {
      return {
        type: 'Unexpected Error',
        icon: '⚠️',
        description: message,
        suggestion: 'If this problem persists, please contact support.'
      };
    }
  };

  const errorInfo = getErrorInfo(error);

  return (
    <AppLayout 
      className="bg-gradient-to-br from-[rgb(var(--background))] via-[rgb(var(--surface))] to-[rgb(var(--error-light))]"
    >
      <div className="w-full space-y-8 text-center animate-fade-in-up">
        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-[rgb(var(--error))] bg-opacity-10 rounded-full blur-3xl animate-pulse-ios" />
          <SimpleMascot state="error" size="lg" />
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))] ios-text">
              Oops! Something went wrong
            </h1>
            <p className="text-base text-[rgb(var(--text-secondary))] ios-text max-w-sm mx-auto leading-relaxed">
              Don't worry, we're here to help you get back on track
            </p>
          </div>

          {/* Error Details Card */}
          <div className="p-5 bg-[rgb(var(--error-light))] border border-[rgb(var(--error))] border-opacity-20 rounded-[var(--radius-xl)] shadow-[var(--shadow-md)]">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[rgb(var(--error))] bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{errorInfo.icon}</span>
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-[rgb(var(--error))] ios-text">
                    {errorInfo.type}
                  </h3>
                  <p className="text-sm text-[rgb(var(--error))] ios-text mt-1 opacity-90">
                    {errorInfo.description}
                  </p>
                </div>
              </div>
              
              {/* Technical Details (Expandable) */}
              <div className="pt-3 border-t border-[rgb(var(--error))] border-opacity-20">
                <details className="text-left">
                  <summary className="text-xs text-[rgb(var(--error))] ios-text cursor-pointer hover:opacity-80">
                    Technical Details
                  </summary>
                  <div className="mt-2 p-2 bg-[rgb(var(--error))] bg-opacity-10 rounded-[var(--radius-sm)]">
                    <code className="text-xs text-[rgb(var(--error))] font-mono">
                      {error.message}
                    </code>
                  </div>
                </details>
              </div>
            </div>
          </div>

          {/* Suggestion Card */}
          <div className="p-4 bg-[rgb(var(--info-light))] border border-[rgb(var(--info))] border-opacity-20 rounded-[var(--radius-lg)]">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[rgb(var(--info))] mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h4 className="font-medium text-[rgb(var(--info))] ios-text text-sm">
                  Suggestion
                </h4>
                <p className="text-sm text-[rgb(var(--info))] ios-text mt-1">
                  {errorInfo.suggestion}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button 
              onClick={onRetry}
              size="lg"
              className="w-full bg-[rgb(var(--accent))] text-white font-semibold shadow-[var(--shadow-md)] ios-button-press"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </Button>

            <Button 
              onClick={() => window.location.reload()}
              variant="secondary"
              size="lg"
              className="w-full"
            >
              <Home className="w-5 h-5 mr-2" />
              Restart App
            </Button>
          </div>

          {/* Error Code */}
          <div className="text-xs text-[rgb(var(--text-muted))] ios-text">
            Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};