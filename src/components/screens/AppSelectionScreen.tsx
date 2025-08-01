import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { FloatingActionButton } from '@/components/navigation/FloatingActionButton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { App } from '@/types';

// Mock app data
const POPULAR_APPS: App[] = [
  { id: '1', name: 'Instagram', category: 'Social' },
  { id: '2', name: 'WhatsApp', category: 'Communication' },
  { id: '3', name: 'TikTok', category: 'Entertainment' },
  { id: '4', name: 'Netflix', category: 'Entertainment' },
  { id: '5', name: 'Spotify', category: 'Music' },
  { id: '6', name: 'Uber', category: 'Transportation' },
  { id: '7', name: 'YouTube', category: 'Entertainment' },
  { id: '8', name: 'Facebook', category: 'Social' },
];

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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) return POPULAR_APPS;
    
    return POPULAR_APPS.filter(app =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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
            placeholder="Search apps..."
            className="pl-10 bg-[hsl(var(--surface))] border-[hsl(var(--surface))] text-[hsl(var(--text-primary))]"
          />
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredApps.map((app) => (
            <Button
              key={app.id}
              variant={selectedApp?.id === app.id ? "default" : "outline"}
              onClick={() => onSelectApp(app)}
              className="w-full justify-start h-auto p-4 text-left"
            >
              <div>
                <div className="font-medium">{app.name}</div>
                <div className="text-xs text-[hsl(var(--text-secondary))] mt-1">
                  {app.category}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {selectedApp && (
        <FloatingActionButton onClick={onNext} />
      )}
    </AppLayout>
  );
};