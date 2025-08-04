import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface LoadingScreenProps {
  onAuthenticated: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onAuthenticated }) => {
  const { login, isAuthenticated, error: authError, isLoading } = useAuth();
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    // If already authenticated, proceed immediately
    if (isAuthenticated && !isLoading) {
      onAuthenticated();
      return;
    }

    // Attempt authentication only once
    if (!hasAttempted && !isLoading) {
      const authenticate = async () => {
        try {
          setHasAttempted(true);
          await login();
          onAuthenticated();
        } catch (error) {
          // Error handling is managed by useAuth hook
          console.error('Authentication failed in LoadingScreen:', error);
        }
      };
      
      authenticate();
    }
  }, [login, onAuthenticated, isAuthenticated, isLoading, hasAttempted]);

  // Show error state if authentication failed
  if (authError && hasAttempted) {
    return (
      <AppLayout 
        className="bg-gradient-to-br from-[rgb(var(--background))] via-[rgb(var(--surface))] to-[rgb(var(--error-light))]"
      >
        <div className="w-full space-y-8 text-center animate-fade-in-up">
          <div className="relative">
            {/* <div className="absolute inset-0 bg-[rgb(var(--error))] bg-opacity-10 rounded-full blur-3xl animate-pulse-ios" /> */}
            <SimpleMascot state="error" size="lg" />
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))] ios-text">
                Authentication Failed
              </h1>
              <p className="text-base text-[rgb(var(--text-secondary))] ios-text max-w-sm mx-auto leading-relaxed">
                We couldn't connect to your Telegram account
              </p>
            </div>

            {/* Error Details Card */}
            <div className="p-5 bg-[rgb(var(--error-light))] border border-[rgb(var(--error))] border-opacity-20 rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[rgb(var(--error))] bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-[rgb(var(--error))]" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-[rgb(var(--error))] ios-text text-sm">
                    Connection Error
                  </h3>
                  <p className="text-sm text-[rgb(var(--error))] ios-text mt-1 opacity-90">
                    {authError || "Please check your internet connection and try again."}
                  </p>
                </div>
              </div>
            </div>

            {/* Retry Button */}
            <div className="pt-4">
              <Button 
                onClick={() => {
                  setHasAttempted(false);
                  window.location.reload();
                }}
                size="lg"
                className="w-full bg-[rgb(var(--error))] text-white font-semibold shadow-[var(--shadow-md)] ios-button-press"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </Button>
            </div>

            {/* Help Text */}
            <div className="p-4 bg-[rgb(var(--info-light))] border border-[rgb(var(--info))] border-opacity-20 rounded-[var(--radius-lg)]">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[rgb(var(--info))] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-[rgb(var(--info))] ios-text">
                  Make sure you're accessing this app through Telegram
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Show loading state
  return (
    <AppLayout className="bg-gradient-to-br from-[rgb(var(--background))] via-[rgb(var(--surface))] to-[rgb(var(--accent-300))] bg-opacity-5">
      <div className="w-full space-y-8 text-center animate-fade-in-up">
        <div className="relative">
          <div className="absolute inset-0 bg-[rgb(var(--accent))] bg-opacity-10 rounded-full blur-3xl animate-pulse-ios" />
          <SimpleMascot state="loading" size="lg" />
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-[rgb(var(--text-primary))] ios-text">
              Welcome to
            </h1>
            <h2 className="text-2xl font-bold text-[rgb(var(--accent))] ios-text">
              Quiby
            </h2>
            <p className="text-base text-[rgb(var(--text-secondary))] ios-text max-w-xs mx-auto leading-relaxed">
              Setting up your personalized experience
            </p>
          </div>

          {/* Loading Indicator */}
          <div className="p-6 bg-[rgb(var(--surface))] border border-[rgb(var(--secondary-600))] rounded-[var(--radius-xl)] shadow-[var(--shadow-md)]">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[rgb(var(--accent))] bg-opacity-10 rounded-full flex items-center justify-center animate-breathe">
                  <svg className="w-6 h-6 text-[rgb(var(--accent))]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118zM18 6l-8 4-8-4 8-4 8 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-[rgb(var(--text-primary))] ios-text">
                    Connecting to Telegram
                  </h3>
                  <p className="text-sm text-[rgb(var(--text-secondary))] ios-text mt-1">
                    Verifying your identity securely...
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 border-2 border-[rgb(var(--accent))] border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            </div>
          </div>

          {/* Loading Steps */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-[rgb(var(--surface-secondary))] rounded-[var(--radius-lg)]">
              <div className="w-6 h-6 bg-[rgb(var(--accent))] rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-[rgb(var(--text-primary))] ios-text">Loading interface...</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-[rgb(var(--surface-secondary))] rounded-[var(--radius-lg)]">
              <div className="w-6 h-6 border-2 border-[rgb(var(--accent))] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-[rgb(var(--text-primary))] ios-text">Authenticating...</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-[rgb(var(--surface-secondary))] rounded-[var(--radius-lg)] opacity-50">
              <div className="w-6 h-6 bg-[rgb(var(--secondary-400))] rounded-full" />
              <span className="text-sm text-[rgb(var(--text-muted))] ios-text">Preparing workspace...</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};