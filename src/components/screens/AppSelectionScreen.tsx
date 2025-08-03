import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { FloatingActionButton } from '@/components/navigation/FloatingActionButton';
import { Input } from '@/components/ui/input';
import { AppCard } from '@/components/ui/app-card';
import { Search, Loader2, AlertCircle } from 'lucide-react';
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
      <div className="w-full space-y-6">
        <div className="text-center space-y-4">
          <SimpleMascot state="idle" size="md" />
          <h1 className="text-lg font-semibold text-[hsl(var(--text-primary))]">
            Select an App
          </h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-muted))]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search app..."
            className="pl-10 bg-[hsl(var(--surface))] border-[hsl(var(--surface))] text-[hsl(var(--text-primary))]"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-[hsl(var(--text-muted))]" />
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {searchResults.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              isSelected={selectedApp?.id === app.id}
              onClick={onSelectApp}
            />
          ))}
          
          {searchResults.length === 0 && !loading && !error && searchQuery.trim() && (
            <div className="text-center py-8 text-[hsl(var(--text-muted))]">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No apps found for "{searchQuery}"</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          )}
          
          {searchResults.length === 0 && !loading && !error && !searchQuery.trim() && (
            <div className="text-center py-12 text-[hsl(var(--text-muted))]">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-base mb-2">Search AppStore</p>
              <p className="text-sm">Enter an app name to find it</p>
            </div>
          )}
        </div>
      </div>

      {selectedApp && (
        <FloatingActionButton onClick={onNext} />
      )}
    </AppLayout>
  );
};