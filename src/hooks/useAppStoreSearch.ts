import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { App } from '@/types';

// === iTunes API Types ===
export type ItunesSearchResult = {
  artworkUrl512: string;
  artistName: string;
  trackName: string;
  trackViewUrl: string;
  trackId: number;
  averageUserRating: number;
  userRatingCount: number;
  primaryGenreName: string;
};

export type ItunesSearchResponse = {
  resultCount: number;
  results: ItunesSearchResult[];
};

// === API Helper ===
async function searchAppStoreAPI(search: string): Promise<ItunesSearchResponse> {
  const response = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(search)}&country=us&entity=software&limit=20`,
    { 
      headers: { 
        'Accept': 'application/json',
      }
    }
  );
  if (!response.ok) {
    throw new Error(`iTunes API error: ${response.status}`);
  }
  return response.json();
}

// === Hook ===
export function useAppStoreSearch() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const [searchResults, setSearchResults] = useState<App[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    searchAppStoreAPI(debouncedQuery)
      .then((res) => {
        if (!active) return;
        const mapped = res.results.map((app) => ({
          id: app.trackId.toString(),
          name: app.trackName,
          url: app.trackViewUrl,
          developer: app.artistName,
          icon: app.artworkUrl512,
          category: app.primaryGenreName,
          userRatingCount: app.userRatingCount,
        }));
        setSearchResults(mapped);
      })
      .catch((err) => {
        if (active) {
          setSearchResults([]);
          setError('Failed to search apps. Please try again.');
          console.error('App Store API error:', err);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading,
    error,
  };
}