import { useEffect } from 'react';
import { useAppFlow } from '@/hooks/useAppFlow';
import { useAuth } from '@/hooks/useAuth';
import { SamplingCriteria } from '@/types';

// Screen imports
import { LoadingScreen } from '@/components/screens/LoadingScreen';
import { WelcomeScreen } from '@/components/screens/WelcomeScreen';
import { AppSelectionScreen } from '@/components/screens/AppSelectionScreen';
import { CountrySelectionScreen } from '@/components/screens/CountrySelectionScreen';
import { SamplingCriteriaScreen } from '@/components/screens/SamplingCriteriaScreen';
import { ProcessingScreen } from '@/components/screens/ProcessingScreen';
import { SuccessScreen } from '@/components/screens/SuccessScreen';
import { ChatScreen } from '@/components/screens/ChatScreen';
import { ErrorScreen } from '@/components/screens/ErrorScreen';

function App() {
  const {
    currentStep,
    selectedApp,
    selectedCountries,
    sagaId,
    results,
    error,
    setStep,
    setAuthenticated,
    selectApp,
    selectCountries,
    setSamplingCriteria,
    setSagaId,
    proceedToNextStep,
    navigateToChat,
    navigateBackFromChat,
    reset,
    setResults
  } = useAppFlow();

  console.log('App render - currentStep:', currentStep, 'sagaId:', sagaId);

  // Handle automatic transition to processing step when sagaId is set
  useEffect(() => {
    if (sagaId && currentStep === 'sampling_criteria') {
      console.log('sagaId detected, transitioning to processing step');
      setStep('processing');
    }
  }, [sagaId, currentStep, setStep]);

  const { isAuthenticated: userIsAuthenticated } = useAuth();

  const handleAuthenticated = () => {
    setAuthenticated(true);
    setStep('welcome');
  };

  useEffect(() => {
    if (userIsAuthenticated) {
      setAuthenticated(true);
      if (currentStep === 'loading') {
        setStep('welcome');
      }
    }
  }, [userIsAuthenticated, currentStep, setAuthenticated, setStep]);

  const handleViewResults = () => {
    console.log('Viewing results:', results);
    alert(`Analysis complete!\n\nApp: ${results?.app.name}\nReviews: ${results?.reviewsCount}\nCountries: ${results?.countries.join(', ')}`);
    reset();
    setStep('welcome');
  };
  const renderCurrentScreen = () => {
    switch (currentStep) {
      case 'loading':
        return <LoadingScreen onAuthenticated={handleAuthenticated} />;
      
      case 'welcome':
        return <WelcomeScreen onStart={proceedToNextStep} />;
      
      case 'app_selection':
        return (
          <AppSelectionScreen
            selectedApp={selectedApp}
            onSelectApp={selectApp}
            onNext={proceedToNextStep}
          />
        );
      
      case 'country_selection':
        return (
          <CountrySelectionScreen
            selectedCountries={selectedCountries || []}
            onSelectCountries={selectCountries}
            onNext={proceedToNextStep}
          />
        );
      
      case 'sampling_criteria':
        return (
          <SamplingCriteriaScreen
            selectedApp={selectedApp}
            selectedCountries={selectedCountries || []}
            onNext={async (criteria: SamplingCriteria, sagaId: string) => {
              console.log('SamplingCriteriaScreen onNext called with:', { criteria, sagaId });
              console.log('Setting sampling criteria and saga ID...');
              
              setSamplingCriteria(criteria);
              setSagaId(sagaId);
              
              console.log('State updates initiated, useEffect should handle transition');
            }}
          />
        );
      
      case 'processing':
        return (
          <ProcessingScreen 
            selectedApp={selectedApp}
            sagaId={sagaId}
            onProcessingComplete={() => {
              // Create mock results when processing completes
              if (selectedApp && selectedCountries) {
                const mockResults = {
                  reviewsCount: Math.floor(Math.random() * 1000) + 100, // TODO: change it to lookup data
                  app: selectedApp,
                  countries: selectedCountries,
                  sagaId: sagaId || `saga_${Date.now()}`,
                };
                setResults(mockResults);
              } else {
                // Fallback: just proceed to next step
                proceedToNextStep();
              }
            }}
            onProcessingError={(errorMessage) => {
              console.error('Processing error:', errorMessage);
            }}
          />
        );
      
      case 'success':
        return results ? (
          <SuccessScreen
            results={results}
            onViewResults={handleViewResults}
            onStartChat={navigateToChat}
          />
        ) : null;
      
      case 'chat':
        return results ? (
          <ChatScreen
            results={results}
            onBack={navigateBackFromChat}
          />
        ) : null;
      
      case 'error':
        return error ? (
          <ErrorScreen
            error={error}
            onRetry={proceedToNextStep}
          />
        ) : null;
      
      default:
        return <LoadingScreen onAuthenticated={handleAuthenticated} />;
    }
  };

  return (
    <div className="min-h-screen w-full">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;