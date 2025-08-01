import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = async () => {
    setIsLoading(true);
    
    // Simulate Telegram Mini App authentication
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsLoading(false);
        resolve();
      }, 2000);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};