import React, { useState } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    testament: '' as '' | 'Ancien' | 'Nouveau',
    book: ''
  });

  const { query, results, loading, error, hasMore, search, loadMore, clearResults } = useSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      search(searchQuery.trim(), {
        testament: filters.testament || undefined,
        book: filters.book || undefined
      });
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setFilters({ testament: '', book: '' });
    clearResults();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Recherche dans la Bible
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Trouvez des versets par mots-clés, thèmes ou références
        </p>
      </div>

      {/* Search Form */}
      <div className="card mb-8">
        <div className="card-body">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher des versets... (ex: amour, paix, Jean 3:16)"
                    className="form-input pl-10 w-full"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn btn-ghost inline-flex items-center space-x-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filtres</span>
                </button>
                
                <button
                  type="submit"
                  disabled={!searchQuery.trim() || loading}
                  className="btn btn-primary inline-flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Rechercher</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Testament</label>
                    <select
                      value={filters.testament}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        testament: e.target.value as '' | 'Ancien' | 'Nouveau'
                      }))}
                      className="form-input"
                    >
                      <option value="">Tous les testaments</option>
                      <option value="Ancien">Ancien Testament</option>
                      <option value="Nouveau">Nouveau Testament</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="form-label">Livre (optionnel)</label>
                    <input
                      type="text"
                      value={filters.book}
                      onChange={(e) => setFilters(prev => ({ ...prev, book: e.target.value }))}
                      placeholder="ex: Matthieu, Psaumes..."
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="btn btn-ghost text-sm"
                  >
                    Effacer les filtres
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Results */}
      {loading && results.length === 0 && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Recherche en cours...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-6">
          <p>{error}</p>
        </div>
      )}

      {query && !loading && results.length === 0 && !error && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucun résultat trouvé
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Essayez avec d'autres mots-clés ou modifiez vos filtres
          </p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {results.length} résultat{results.length > 1 ? 's' : ''} pour "{query}"
            </p>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={`${result.id}-${index}`} className="card hover:shadow-md transition-shadow">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      <span className="font-medium text-primary-600 dark:text-primary-400">
                        {result.book_name} {result.chapter_number}:{result.verse_number}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                        {result.testament}
                      </span>
                    </div>
                  </div>
                  
                  <div 
                    className="verse-text text-gray-900 dark:text-white"
                    dangerouslySetInnerHTML={{ __html: result.highlighted_text || result.text }}
                  />
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="btn btn-secondary inline-flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    <span>Chargement...</span>
                  </>
                ) : (
                  <span>Charger plus de résultats</span>
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Popular searches or suggestions could go here */}
      {!query && !loading && (
        <div className="card">
          <div className="card-body text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Commencez votre recherche
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Entrez des mots-clés pour trouver des versets dans toute la Bible
            </p>
            
            <div className="flex flex-wrap justify-center gap-2">
              {['amour', 'paix', 'joie', 'espoir', 'foi', 'grâce'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    search(term);
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;

