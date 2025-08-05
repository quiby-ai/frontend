import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { useAuth } from '@/hooks/useAuth';
import { ErrorScreen } from './ErrorScreen';

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
    const authenticationError = new Error(
      authError || 'auth token expired or could not connect to Telegram'
    );
    
    return (
      <ErrorScreen 
        error={authenticationError}
        onRetry={() => {
          setHasAttempted(false);
          window.location.reload();
        }}
      />
    );
  }

  // Show loading state
  return (
    <AppLayout className="bg-gradient-to-br from-[rgb(var(--background))] via-[rgb(var(--surface))] to-[rgb(var(--accent-300))] bg-opacity-5">
      <div className="w-full space-y-8 text-center animate-fade-in-up">
        <div className="relative">
          {/* <div className="absolute inset-0 bg-[rgb(var(--accent))] bg-opacity-10 rounded-full blur-3xl animate-pulse-ios" /> */}
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
                    <svg className="w-6 h-6 text-[rgb(var(--accent))]" fill="white" viewBox="0 0 24 24">
                      <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
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
          {/* <div className="space-y-3">
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
          </div> */}
        </div>
      </div>
    </AppLayout>
  );
};