import React, { useEffect, useState } from 'react';
import { Heart, BookOpen, Trash2, Edit3, Calendar } from 'lucide-react';
import { useAnnotations } from '../hooks/useAnnotations';

const AnnotationsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'favorites' | 'notes'>('all');
  const { annotations, loading, error, loadAnnotations, deleteAnnotation } = useAnnotations();

  useEffect(() => {
    const filterType = filter === 'all' ? undefined : filter;
    loadAnnotations(filterType);
  }, [filter, loadAnnotations]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annotation ?')) {
      try {
        await deleteAnnotation(id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && annotations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement des annotations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Mes Annotations
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Retrouvez vos notes et versets favoris
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="card-body">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Toutes les annotations
            </button>
            <button
              onClick={() => setFilter('favorites')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center space-x-1 ${
                filter === 'favorites'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Heart className="h-4 w-4" />
              <span>Favoris</span>
            </button>
            <button
              onClick={() => setFilter('notes')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center space-x-1 ${
                filter === 'notes'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Edit3 className="h-4 w-4" />
              <span>Notes</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Annotations List */}
      {annotations.length === 0 && !loading ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {filter === 'favorites' 
                ? 'Aucun favori pour le moment'
                : filter === 'notes'
                ? 'Aucune note pour le moment'
                : 'Aucune annotation pour le moment'
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Commencez à annoter vos versets préférés lors de votre lecture
            </p>
            <a
              href="/bible"
              className="btn btn-primary inline-flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Commencer la lecture</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {annotations.map((annotation) => (
            <div key={annotation.id} className="card hover:shadow-md transition-shadow">
              <div className="card-body">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    <span className="font-medium text-primary-600 dark:text-primary-400">
                      {annotation.book_name} {annotation.chapter_number}:{annotation.verse_number}
                    </span>
                    {annotation.is_favorite && (
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDelete(annotation.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Supprimer l'annotation"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Verse Text */}
                <div className="verse-text text-gray-900 dark:text-white mb-4">
                  "{annotation.verse_text}"
                </div>

                {/* Note */}
                {annotation.note && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Ma note :
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {annotation.note}
                    </p>
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Créé le {formatDate(annotation.created_at)}</span>
                  </div>
                  
                  {annotation.color && annotation.color !== '#fbbf24' && (
                    <div className="flex items-center space-x-1">
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: annotation.color }}
                      ></div>
                      <span>Surligné</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && annotations.length > 0 && (
        <div className="text-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      )}
    </div>
  );
};

export default AnnotationsPage;

