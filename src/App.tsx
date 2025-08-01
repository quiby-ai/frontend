import React, { useEffect } from 'react';
import { useAppFlow } from '@/hooks/useAppFlow';

// Screen imports
import { LoadingScreen } from '@/components/screens/LoadingScreen';
import { WelcomeScreen } from '@/components/screens/WelcomeScreen';
import { AppSelectionScreen } from '@/components/screens/AppSelectionScreen';
import { CountrySelectionScreen } from '@/components/screens/CountrySelectionScreen';
import { TokenLimitScreen } from '@/components/screens/TokenLimitScreen';
import { ProcessingScreen } from '@/components/screens/ProcessingScreen';
import { SuccessScreen } from '@/components/screens/SuccessScreen';
import { ErrorScreen } from '@/components/screens/ErrorScreen';

function App() {
  const {
    currentStep,
    selectedApp,
    selectedCountries,
    tokenLimit,
    results,
    error,
    isAuthenticated,
    setStep,
    setAuthenticated,
    selectApp,
    selectCountries,
    setTokenLimit,
    proceedToNextStep,
    reset
  } = useAppFlow();

  // Handle authentication completion
  const handleAuthenticated = () => {
    setAuthenticated(true);
    setStep('welcome');
  };

  // Handle viewing results (could navigate to external link or new screen)
  const handleViewResults = () => {
    // In a real app, this would navigate to a detailed results page
    // For demo purposes, we'll just reset the flow
    console.log('Viewing results:', results);
    alert(`Analysis complete!\n\nApp: ${results?.app.name}\nReviews: ${results?.reviewCount}\nCountries: ${results?.countries.join(', ')}`);
    reset();
    setStep('welcome');
  };

  // Render the appropriate screen based on current step
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
      
      case 'token_limit':
        return (
          <TokenLimitScreen
            tokenLimit={tokenLimit || 1000}
            onSetTokenLimit={setTokenLimit}
            onNext={proceedToNextStep}
          />
        );
      
      case 'processing':
        return <ProcessingScreen selectedApp={selectedApp} />;
      
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