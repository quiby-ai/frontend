import { AuthResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const LOGIN_ENDPOINT = import.meta.env.VITE_LOGIN_ENDPOINT || '/login';
export const authenticateWithTelegram = async (initData: string): Promise<AuthResponse> => {
  try {
    if (!initData) {
      throw new Error('Telegram initData not available. This app must be run inside Telegram.');
    }

    const loginUrl = `${API_BASE_URL}${LOGIN_ENDPOINT}`;
    
    console.log('Authenticating with:', loginUrl);
    console.log('Using Authorization header with tma format');

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `tma ${initData}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Authentication failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const authData: AuthResponse = await response.json();

    if (authData.token) {
      sessionStorage.setItem('jwt_token', authData.token);
      if (authData.user) {
        sessionStorage.setItem('user_data', JSON.stringify(authData.user));
      }
    } else {
      throw new Error('No token received from authentication endpoint');
    }

    return authData;
  } catch (error) {
    console.error('Authentication error:', error);
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user_data');
    throw error;
  }
};

export const getStoredToken = (): string | null => {
  return sessionStorage.getItem('jwt_token');
};

export const getStoredUserData = (): any | null => {
  const userData = sessionStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

export const clearAuthData = (): void => {
  sessionStorage.removeItem('jwt_token');
  sessionStorage.removeItem('user_data');
};

export const isAuthenticated = (): boolean => {
  const token = getStoredToken();
  return !!token;
};