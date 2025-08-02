export interface App {
  id: string;
  name: string;
  icon?: string;
  category?: string;
}

export interface Country {
  code: string;
  name: string;
  flag?: string;
}

export interface ProcessingResults {
  reviewCount: number;
  app: App;
  countries: string[];
  tokenLimit: number;
  jobId: string;
}

export type AppStep = 
  | 'loading' 
  | 'welcome' 
  | 'app_selection' 
  | 'country_selection' 
  | 'token_limit' 
  | 'processing' 
  | 'success' 
  | 'error';

export type MascotState = 'idle' | 'loading' | 'success' | 'error';

export interface AuthResponse {
  token: string;
  user?: {
    id: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface TelegramWebAppUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface AppState {
  currentStep: AppStep;
  selectedApp?: App;
  selectedCountries?: string[];
  tokenLimit?: number;
  jobId?: string;
  results?: ProcessingResults;
  error?: Error;
  isAuthenticated: boolean;
}