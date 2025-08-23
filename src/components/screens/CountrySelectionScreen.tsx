import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { FloatingActionButton } from '@/components/navigation/FloatingActionButton';
import { Globe } from 'lucide-react';
import { Country } from '@/types';

const POPULAR_COUNTRIES: Country[] = [
  { code: 'us', name: 'United States', flag: '🇺🇸' },
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'de', name: 'Germany', flag: '🇩🇪' },
  { code: 'fr', name: 'France', flag: '🇫🇷' },
  { code: 'jp', name: 'Japan', flag: '🇯🇵' },
  { code: 'au', name: 'Australia', flag: '🇦🇺' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦' },
  { code: 'br', name: 'Brazil', flag: '🇧🇷' },
];

interface CountrySelectionScreenProps {
  selectedCountries: string[];
  onSelectCountries: (countries: string[]) => void;
  onNext: () => void;
}

export const CountrySelectionScreen: React.FC<CountrySelectionScreenProps> = ({
  selectedCountries,
  onSelectCountries,
  onNext
}) => {
  const [isWorldwide, setIsWorldwide] = useState(false);

  const toggleCountry = (countryCode: string) => {
    if (isWorldwide) {
      setIsWorldwide(false);
      onSelectCountries([countryCode]);
    } else {
      const newSelection = selectedCountries.includes(countryCode)
        ? selectedCountries.filter(c => c !== countryCode)
        : [...selectedCountries, countryCode];
      onSelectCountries(newSelection);
    }
  };

  const selectWorldwide = () => {
    setIsWorldwide(true);
    onSelectCountries(['worldwide']);
  };

  const hasSelection = selectedCountries.length > 0 || isWorldwide;

  return (
    <AppLayout>
      <div className="w-full space-y-8 animate-fade-in-up pb-24">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="relative">
            {/* <div className="absolute inset-0 bg-[rgb(var(--accent))] bg-opacity-5 rounded-full blur-2xl animate-pulse-ios" /> */}
            <SimpleMascot state="world" size="md" />
          </div>
          <p className="text-base text-[rgb(var(--text-secondary))] ios-text leading-relaxed max-w-xs mx-auto">
            Select countries for analysis
          </p>
        </div>

        {/* Worldwide Option */}
        <div className="space-y-4">
          <button
            onClick={selectWorldwide}
            className={`w-full p-5 rounded-[var(--radius-xl)] border-2 transition-all duration-200 ease-out touch-44 touch-feedback ${
              isWorldwide 
                ? 'bg-[rgb(var(--accent))] border-[rgb(var(--accent))] text-[rgb(var(--accent-foreground))] shadow-[var(--shadow-lg)]' 
                : 'bg-[rgb(var(--surface))] border-[rgb(var(--secondary-600))] text-[rgb(var(--text-primary))] shadow-[var(--shadow-sm)]'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isWorldwide ? 'bg-[rgb(var(--accent-foreground))]' : 'bg-[rgb(var(--accent))] bg-opacity-10'
              }`}>
                <Globe className={`w-6 h-6 ${ isWorldwide ? 'text-[rgb(var(--accent))]' : 'text-[rgb(var(--surface))]'}`} />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-lg ios-text">Worldwide Analysis</h3>
                <p className={`text-sm mt-1 ios-text ${
                  isWorldwide ? 'text-[rgb(var(--accent-foreground))] opacity-90' : 'text-[rgb(var(--text-secondary))]'
                }`}>
                  All countries globally
                </p>
              </div>
              {isWorldwide && (
                <div className="w-6 h-6 bg-[rgb(var(--accent-foreground))] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-[rgb(var(--accent))]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>

          {/* Divider */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 h-px bg-[rgb(var(--secondary-500))]"></div>
            <span className="text-sm text-[rgb(var(--text-muted))] ios-text">or</span>
            <div className="flex-1 h-px bg-[rgb(var(--secondary-500))]"></div>
          </div>
        </div>

        {/* Country Grid */}
        <div className="space-y-4">
          <h3 className="text-base font-medium text-[rgb(var(--text-primary))] ios-text">
            Select specific countries:
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {POPULAR_COUNTRIES.map((country, index) => {
              const isSelected = selectedCountries.includes(country.code);
              return (
                <button
                  key={country.code}
                  onClick={() => toggleCountry(country.code)}
                  disabled={isWorldwide}
                  className={`p-4 rounded-[var(--radius-lg)] border transition-all duration-200 ease-out touch-44 touch-feedback animate-fade-in-up ${
                    isSelected 
                      ? 'bg-[rgb(var(--accent))] border-[rgb(var(--accent))] text-[rgb(var(--accent-foreground))] shadow-[var(--shadow-md)]' 
                      : 'bg-[rgb(var(--surface))] border-[rgb(var(--secondary-600))] text-[rgb(var(--text-primary))] shadow-[var(--shadow-sm)]'
                  } ${isWorldwide ? 'opacity-50' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm ios-text">{country.name}</div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-[rgb(var(--accent-foreground))] rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-[rgb(var(--accent))]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Countries Summary */}
        {!isWorldwide && selectedCountries.length > 0 && (
          <div className="p-4 bg-[rgb(var(--success-light))] border border-[rgb(var(--success))] border-opacity-20 rounded-[var(--radius-lg)] animate-fade-in-scale">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-[rgb(var(--success))]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-[rgb(var(--success))] ios-text">
                {selectedCountries.length} {selectedCountries.length === 1 ? 'country' : 'countries'} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCountries.map((code) => {
                const country = POPULAR_COUNTRIES.find(c => c.code === code);
                return (
                  <span 
                    key={code} 
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[rgb(var(--success))] bg-opacity-20 rounded-[var(--radius-sm)] text-xs text-[rgb(var(--surface-secondary))] ios-text"
                  >
                    {country?.flag} {country?.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {hasSelection && (
        <FloatingActionButton 
          onClick={onNext} 
          label={`Continue with ${isWorldwide ? 'Worldwide' : selectedCountries.length + ' ' + (selectedCountries.length === 1 ? 'Country' : 'Countries')}`}
        />
      )}
    </AppLayout>
  );
};