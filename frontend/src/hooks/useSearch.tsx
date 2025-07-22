import React, { createContext, useContext, useState, useCallback } from 'react';
import { SearchResult, SearchContextType, SearchFilters } from '../types';
import { searchApi } from '../utils/api';

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: React.ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});
  const [currentOffset, setCurrentOffset] = useState<number>(0);

  const search = useCallback(async (searchQuery: string, filters: SearchFilters = {}) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasMore(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setQuery(searchQuery);
      setCurrentFilters(filters);
      setCurrentOffset(0);

      const searchData = await searchApi.search(searchQuery, {
        ...filters,
        limit: filters.limit || 20,
        offset: 0
      });

      setResults(searchData.results);
      setHasMore(searchData.pagination.hasMore);
      setCurrentOffset(searchData.results.length);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche');
      setResults([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!query.trim() || loading || !hasMore) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const searchData = await searchApi.search(query, {
        ...currentFilters,
        limit: currentFilters.limit || 20,
        offset: currentOffset
      });

      setResults(prevResults => [...prevResults, ...searchData.results]);
      setHasMore(searchData.pagination.hasMore);
      setCurrentOffset(prevOffset => prevOffset + searchData.results.length);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des résultats supplémentaires');
    } finally {
      setLoading(false);
    }
  }, [query, currentFilters, currentOffset, loading, hasMore]);

  const clearResults = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    setHasMore(false);
    setCurrentFilters({});
    setCurrentOffset(0);
  }, []);

  const value: SearchContextType = {
    query,
    results,
    loading,
    error,
    hasMore,
    search,
    loadMore,
    clearResults
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

