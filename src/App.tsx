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
    reset
  } = useAppFlow();

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
    alert(`Analysis complete!\n\nApp: ${results?.app.name}\nReviews: ${results?.reviewCount}\nCountries: ${results?.countries.join(', ')}`);
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
              setSamplingCriteria(criteria);
              setSagaId(sagaId);
              proceedToNextStep();
            }}
          />
        );
      
      case 'processing':
        return (
          <ProcessingScreen 
            selectedApp={selectedApp}
            sagaId={sagaId}
            onProcessingComplete={() => {
              proceedToNextStep();
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