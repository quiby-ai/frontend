import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

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
      <AppLayout>
        <div className="flex flex-col items-center justify-center space-y-8">
          <SimpleMascot state="error" size="lg" />
          
          <div className="text-center space-y-3">
            <h1 className="text-xl font-semibold text-[hsl(var(--text-primary))]">
              Authentication Failed
            </h1>
            <p className="text-sm text-[hsl(var(--text-secondary))] max-w-md">
              {authError}
            </p>
            <div className="pt-4">
              <Button 
                onClick={() => {
                  setHasAttempted(false);
                  window.location.reload();
                }}
                variant="default"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Show loading state
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center space-y-8">
        <SimpleMascot state="loading" size="lg" />
        
        <div className="text-center space-y-3">
          <h1 className="text-xl font-semibold text-[hsl(var(--text-primary))]">
            Initializing Quiby
          </h1>
          <p className="text-sm text-[hsl(var(--text-secondary))]">
            Authenticating with Telegram...
          </p>
        </div>
      </div>
    </AppLayout>
  );
};