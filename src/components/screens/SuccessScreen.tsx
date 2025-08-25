import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { Button } from '@/components/ui/button';
import { ProcessingResults } from '@/types';
import { BarChart3, Globe, Users } from 'lucide-react';

interface SuccessScreenProps {
  results: ProcessingResults;
  onViewResults: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ 
  results, 
  onViewResults 
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const getAnalysisScope = () => {
    if (results.countries.includes('worldwide')) {
      return { type: 'Worldwide', count: 'All countries', icon: Globe };
    }
    return { 
      type: 'Regional', 
      count: `${results.countries.length} ${results.countries.length === 1 ? 'country' : 'countries'}`,
      icon: Users 
    };
  };

  const scope = getAnalysisScope();

  return (
    <AppLayout 
      className="bg-gradient-to-br from-[rgb(var(--background))] via-[rgb(var(--surface))] to-[rgb(var(--success-light))]"
    >
      <div className="w-full space-y-8 text-center animate-fade-in-up">
        {/* Celebration Hero */}
        <div className="relative">
          {/* <div className="absolute inset-0 bg-[rgb(var(--success))] bg-opacity-10 rounded-full blur-3xl animate-pulse-ios" /> */}
          <SimpleMascot state="success" size="lg" />
          
          {/* Celebration Emojis */}
          <div className="absolute -top-1 -left-1 text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>🎉</div>
          <div className="absolute top-0 -right-3 text-xl animate-bounce" style={{ animationDelay: '0.3s' }}>✨</div>
          <div className="absolute bottom-0 -left-3 text-lg animate-bounce" style={{ animationDelay: '0.5s' }}>🚀</div>
          <div className="absolute -bottom-1 -right-1 text-xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎊</div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-[rgb(var(--text-primary))] ios-text">
              Analysis Complete!
            </h1>
            <p className="text-lg text-[rgb(var(--success))] font-semibold ios-text">
              {results.app.name}
            </p>
            <p className="text-base text-[rgb(var(--text-secondary))] ios-text max-w-sm mx-auto leading-relaxed">
              Your comprehensive review analysis is ready
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Reviews Analyzed */}
            <div className="p-5 bg-[rgb(var(--success-light))] border border-[rgb(var(--success))] border-opacity-20 rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] animate-fade-in-scale">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-[rgb(var(--success))] bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
                  <BarChart3 className="w-6 h-6 text-[rgb(var(--surface))]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[rgb(var(--success))] ios-text">
                    {formatNumber(results.reviewsCount)}
                  </div>
                  <div className="text-sm text-[rgb(var(--success))] ios-text">
                    Reviews Analyzed
                  </div>
                </div>
              </div>
            </div>

            {/* Coverage */}
            <div className="p-5 bg-[rgb(var(--accent-300))] bg-opacity-10 border border-[rgb(var(--accent))] border-opacity-20 rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] animate-fade-in-scale" style={{ animationDelay: '0.1s' }}>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-[rgb(var(--accent))] bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
                  <scope.icon className="w-6 h-6 text-[rgb(var(--surface))]" />
                </div>
                <div>
                  <div className="text-lg font-bold text-[rgb(var(--accent))] ios-text">
                    {scope.type}
                  </div>
                  <div className="text-sm text-[rgb(var(--accent))] ios-text">
                    {scope.count}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Summary */}
          {/* <div className="p-6 bg-[rgb(var(--surface))] border border-[rgb(var(--secondary-600))] rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[rgb(var(--info))] bg-opacity-20 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[rgb(var(--info))]" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-[rgb(var(--text-primary))] ios-text">
                    Analysis Summary
                  </h3>
                  <p className="text-sm text-[rgb(var(--text-secondary))] ios-text">
                    AI-powered insights generated successfully
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-[rgb(var(--secondary-500))]">
                <div className="text-center">
                  <div className="text-lg font-semibold text-[rgb(var(--accent))] ios-text">
                    {formatNumber(results.tokenLimit)}
                  </div>
                  <div className="text-xs text-[rgb(var(--text-muted))] ios-text">
                    Tokens Used
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-semibold text-[rgb(var(--success))] ios-text">
                    100%
                  </div>
                  <div className="text-xs text-[rgb(var(--text-muted))] ios-text">
                    Completed
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-semibold text-[rgb(var(--info))] ios-text">
                    AI
                  </div>
                  <div className="text-xs text-[rgb(var(--text-muted))] ios-text">
                    Powered
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Countries List (if not worldwide) */}
          {/* {!results.countries.includes('worldwide') && results.countries.length > 0 && (
            <div className="p-4 bg-[rgb(var(--info-light))] border border-[rgb(var(--info))] border-opacity-20 rounded-[var(--radius-lg)] animate-fade-in-scale" style={{ animationDelay: '0.3s' }}>
              <div className="space-y-3">
                <h4 className="font-medium text-[rgb(var(--info))] ios-text text-sm">
                  Countries Analyzed
                </h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {results.countries.slice(0, 6).map((country) => (
                    <span 
                      key={country}
                      className="inline-flex items-center px-3 py-1 bg-[rgb(var(--info))] bg-opacity-20 rounded-full text-xs text-[rgb(var(--info))] ios-text font-medium"
                    >
                      {country}
                    </span>
                  ))}
                  {results.countries.length > 6 && (
                    <span className="inline-flex items-center px-3 py-1 bg-[rgb(var(--info))] bg-opacity-20 rounded-full text-xs text-[rgb(var(--info))] ios-text font-medium">
                      +{results.countries.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )} */}

          {/* Action Button */}
          <div className="pt-4">
            <Button 
              onClick={onViewResults}
              size="lg"
              className="w-full bg-[rgb(var(--success))] text-white font-semibold shadow-[var(--shadow-lg)] ios-button-press"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              View Detailed Results
            </Button>
          </div>

          {/* Saga ID for Reference */}
          <div className="text-xs text-[rgb(var(--text-muted))] ios-text">
            Analysis ID: {results.sagaId}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};