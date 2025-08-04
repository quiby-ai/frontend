import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { FloatingActionButton } from '@/components/navigation/FloatingActionButton';
import { Input } from '@/components/ui/input';
import { AppCard } from '@/components/ui/app-card';
import { Search, AlertCircle } from 'lucide-react';
import { App } from '@/types';
import { useAppStoreSearch } from '@/hooks/useAppStoreSearch';

interface AppSelectionScreenProps {
  selectedApp?: App;
  onSelectApp: (app: App) => void;
  onNext: () => void;
}

export const AppSelectionScreen: React.FC<AppSelectionScreenProps> = ({
  selectedApp,
  onSelectApp,
  onNext
}) => {
  const { searchQuery, setSearchQuery, searchResults, loading, error } = useAppStoreSearch();

  return (
    <AppLayout>
      <div className="w-full space-y-6 animate-fade-in-up pb-24">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="relative">
            {/* <div className="absolute inset-0 bg-[rgb(var(--accent))] bg-opacity-5 rounded-full blur-2xl animate-pulse-ios" /> */}
            <SimpleMascot state="search" size="md" />
          </div>
          <div className="space-y-2">
            <p className="text-base text-[rgb(var(--text-secondary))] ios-text leading-relaxed">
              Search and select the app you want to analyze
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[rgb(var(--text-muted))]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search App Store..."
              className="pl-12 pr-12 h-14 text-lg bg-[rgb(var(--surface))] border-[rgb(var(--secondary-600))] rounded-[var(--radius-xl)] focus:ring-[rgb(var(--accent))] focus:border-[rgb(var(--accent))] ios-text"
            />
            {loading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-[rgb(var(--accent))] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Search Tips */}
          {!searchQuery.trim() && !loading && (
            <div className="px-4 py-3 bg-[rgb(var(--info-light))] border border-[rgb(var(--info))] border-opacity-20 rounded-[var(--radius-lg)]">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-[rgb(var(--info))] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-[rgb(var(--info))] ios-text">
                  <strong>Search Tips:</strong> Try app names like "Instagram", "WhatsApp", or "Spotify" for best results.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-[rgb(var(--error-light))] border border-[rgb(var(--error))] border-opacity-20 rounded-[var(--radius-lg)]">
            <AlertCircle className="w-5 h-5 text-[rgb(var(--error))] flex-shrink-0" />
            <span className="text-sm text-[rgb(var(--error))] ios-text">{error}</span>
          </div>
        )}

        {/* Results Section */}
        <div className="space-y-3">
          {/* Selected App Preview */}
          {selectedApp && (
            <div className="p-4 bg-[rgb(var(--success-light))] border border-[rgb(var(--success))] border-opacity-20 rounded-[var(--radius-lg)] animate-fade-in-scale">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-[rgb(var(--success))]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-[rgb(var(--success))] ios-text">
                  Selected: {selectedApp.name}
                </span>
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {searchResults.map((app, index) => (
              <div 
                key={app.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <AppCard
                  app={app}
                  isSelected={selectedApp?.id === app.id}
                  onClick={onSelectApp}
                />
              </div>
            ))}
          </div>

          {/* Empty States */}
          {searchResults.length === 0 && !loading && !error && searchQuery.trim() && (
            <div className="text-center py-12 space-y-4 animate-fade-in-up">
              {/* TODO: change icon */}
              {/* <div className="w-16 h-16 mx-auto bg-[rgb(var(--secondary-400))] bg-opacity-20 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-[rgb(var(--text-muted))]" />
              </div> */}
              <div className="space-y-2">
                <p className="text-base font-medium text-[rgb(var(--text-primary))] ios-text">
                  No apps found
                </p>
                <p className="text-sm text-[rgb(var(--text-secondary))] ios-text">
                  Try searching for "{searchQuery}" with different spelling or try a different app name
                </p>
              </div>
            </div>
          )}
          
          {/* {searchResults.length === 0 && !loading && !error && !searchQuery.trim() && (
            <div className="text-center py-16 space-y-6 animate-fade-in-up">
              <div className="w-20 h-20 mx-auto bg-[rgb(var(--accent))] bg-opacity-10 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-[rgb(var(--accent))]" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-[rgb(var(--text-primary))] ios-text">
                  Search App Store
                </h3>
                <p className="text-base text-[rgb(var(--text-secondary))] ios-text max-w-xs mx-auto leading-relaxed">
                  Enter the name of the app you want to analyze in the search box above
                </p>
              </div>
            </div>
          )} */}
        </div>
      </div>

      {/* Bottom Action */}
      {selectedApp && (
        <FloatingActionButton 
          onClick={onNext} 
          label="Continue with App"
        />
      )}
    </AppLayout>
  );
};