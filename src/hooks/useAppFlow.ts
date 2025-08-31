import { useState, useCallback } from 'react';
import { AppState, AppStep, App, ProcessingResults, SamplingCriteria } from '@/types';

const initialState: AppState = {
  currentStep: 'loading',
  isAuthenticated: false,
};

export const useAppFlow = () => {
  const [state, setState] = useState<AppState>(initialState);

  const setStep = useCallback((step: AppStep) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const setAuthenticated = useCallback((isAuthenticated: boolean) => {
    setState(prev => ({ ...prev, isAuthenticated }));
  }, []);

  const selectApp = useCallback((app: App) => {
    setState(prev => ({ ...prev, selectedApp: app }));
    console.debug(app);
  }, []);

  const selectCountries = useCallback((countries: string[]) => {
    setState(prev => ({ ...prev, selectedCountries: countries }));
  }, []);

  const setSamplingCriteria = useCallback((criteria: SamplingCriteria) => {
    setState(prev => ({ ...prev, samplingCriteria: criteria }));
  }, []);

  const setSagaId = useCallback((sagaId: string) => {
    setState(prev => ({ ...prev, sagaId }));
  }, []);

  const setError = useCallback((error: Error) => {
    setState(prev => ({ ...prev, error, currentStep: 'error' }));
  }, []);

  const setResults = useCallback((results: ProcessingResults) => {
    setState(prev => ({ ...prev, results, currentStep: 'success' }));
  }, []);

  const startProcessing = useCallback(() => {
    const jobId = `job_${Date.now()}`;
    setState(prev => ({ ...prev, jobId, currentStep: 'processing' }));
  }, [state.selectedApp, state.selectedCountries, state.samplingCriteria]);

  const proceedToNextStep = useCallback(() => {
    const { currentStep } = state;
    
    switch (currentStep) {
      case 'loading':
        setStep('welcome');
        break;
      case 'welcome':
        setStep('app_selection');
        break;
      case 'app_selection':
        if (state.selectedApp) {
          setStep('country_selection');
        }
        break;
      case 'country_selection':
        if (state.selectedCountries?.length) {
          setStep('sampling_criteria');
        }
        break;
      case 'sampling_criteria':
        if (state.samplingCriteria) {
          // Transition directly to processing step - WebSocket will handle real-time updates
          setStep('processing');
        }
        break;
      case 'success':
        // Stay on success step - user can choose to view results or start chat
        break;
      case 'chat':
        // Stay on chat step - user can continue chatting or go back
        break;
      case 'error':
        setStep('welcome');
        break;
    }
  }, [state, setStep]);

  const navigateToChat = useCallback(() => {
    setStep('chat');
  }, [setStep]);

  const navigateBackFromChat = useCallback(() => {
    setStep('success');
  }, [setStep]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    setStep,
    setAuthenticated,
    selectApp,
    selectCountries,
    setSamplingCriteria,
    setSagaId,
    setError,
    setResults,
    startProcessing,
    proceedToNextStep,
    navigateToChat,
    navigateBackFromChat,
    reset,
  };
};