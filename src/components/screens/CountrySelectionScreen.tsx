import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { FloatingActionButton } from '@/components/navigation/FloatingActionButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';
import { Country } from '@/types';

const POPULAR_COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
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
      <div className="w-full space-y-6">
        <div className="text-center space-y-4">
          <SimpleMascot state="idle" size="md" />
          <h1 className="text-lg font-semibold text-[hsl(var(--text-primary))]">
            Select Countries
          </h1>
        </div>

        <Button
          variant={isWorldwide ? "default" : "outline"}
          onClick={selectWorldwide}
          className="w-full h-auto p-4"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Worldwide Analysis</div>
              <div className="text-xs text-[hsl(var(--text-secondary))] mt-1">
                Analyze reviews from all countries
              </div>
            </div>
          </div>
        </Button>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[hsl(var(--text-secondary))]">
            Or select specific countries:
          </h3>
          
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_COUNTRIES.map((country) => (
              <Button
                key={country.code}
                variant={selectedCountries.includes(country.code) ? "default" : "outline"}
                onClick={() => toggleCountry(country.code)}
                className="h-auto p-3 text-left justify-start"
                disabled={isWorldwide}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-sm">{country.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {!isWorldwide && selectedCountries.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedCountries.map((code) => {
              const country = POPULAR_COUNTRIES.find(c => c.code === code);
              return (
                <Badge key={code} variant="secondary">
                  {country?.flag} {country?.name}
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      {hasSelection && (
        <FloatingActionButton onClick={onNext} />
      )}
    </AppLayout>
  );
};