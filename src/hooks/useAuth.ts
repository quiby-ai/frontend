import { useState, useEffect } from 'react';
import { 
  authenticateWithTelegram, 
  getStoredToken, 
  clearAuthData, 
  isAuthenticated as checkAuthStatus 
} from '@/services/auth';
import { useTelegram } from './useTelegram';
import { AuthResponse } from '@/types';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { initData } = useTelegram();

  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        const isAuth = checkAuthStatus();
        setIsAuthenticated(isAuth);
        
        if (isAuth) {
          const userData = sessionStorage.getItem('user_data');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (err) {
        console.error('Error checking existing auth:', err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingAuth();
  }, []);

  const login = async (): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const authData = await authenticateWithTelegram(initData || '');
      
      setIsAuthenticated(true);
      setUser(authData.user || null);
      
      return authData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    error,
    login,
    logout,
    token: getStoredToken()
  };
};