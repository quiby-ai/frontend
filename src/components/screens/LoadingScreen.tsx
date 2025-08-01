import React, { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { useAuth } from '@/hooks/useAuth';

interface LoadingScreenProps {
  onAuthenticated: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onAuthenticated }) => {
  const { login } = useAuth();

  useEffect(() => {
    const authenticate = async () => {
      await login();
      onAuthenticated();
    };
    
    authenticate();
  }, [login, onAuthenticated]);

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center space-y-8">
        <SimpleMascot state="loading" size="lg" />
        
        <div className="text-center space-y-3">
          <h1 className="text-xl font-semibold text-[hsl(var(--text-primary))]">
            Initializing Quiby
          </h1>
          <p className="text-sm text-[hsl(var(--text-secondary))]">
            Setting up your review analysis workspace...
          </p>
        </div>
      </div>
    </AppLayout>
  );
};