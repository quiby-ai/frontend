export interface App {
  id: string;
  name: string;
  icon?: string;
  category?: string;
  url?: string;
  developer?: string;
  userRatingCount?: number;
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
  | 'sampling_criteria' 
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

export type SamplingMode = 'version' | 'dateRange';

export interface SamplingCriteria {
  mode: SamplingMode;
  versions?: string[];
  dateFrom?: string;
  dateTo?: string;
}

export interface AppState {
  currentStep: AppStep;
  selectedApp?: App;
  selectedCountries?: string[];
  samplingCriteria?: SamplingCriteria;
  jobId?: string;
  results?: ProcessingResults;
  error?: Error;
  isAuthenticated: boolean;
}