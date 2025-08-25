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
  reviewsCount: number;
  app: App;
  countries: string[];
  sagaId: string;
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

export type MascotState = 'idle' | 'loading' | 'success' | 'error' | 'search' | 'world' | 'sampling' | 'processing.fetch' | 'processing.analyze' | 'processing.process' | 'processing.generate';

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
  sagaId?: string;
  results?: ProcessingResults;
  error?: Error;
  isAuthenticated: boolean;
}

export interface WebSocketMessage {
  step: string;
  status: string;
  context: {
    message: string;
  };
}

export type ProcessingStep = 'extract' | 'prepare';
export type ProcessingStatus = 'running' | 'completed' | 'failed';

export interface ProcessingStepInfo {
  step: ProcessingStep;
  status: ProcessingStatus;
  message: string;
  icon: string;
  description: string;
  image: string;
  isActive: boolean;
  isCompleted: boolean;
  isFailed: boolean;
}