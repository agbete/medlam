import React, { createContext, useContext, useState, useCallback } from 'react';
import { Annotation, AnnotationContextType } from '../types';
import { annotationApi } from '../utils/api';

const AnnotationContext = createContext<AnnotationContextType | undefined>(undefined);

export const useAnnotations = () => {
  const context = useContext(AnnotationContext);
  if (!context) {
    throw new Error('useAnnotations must be used within an AnnotationProvider');
  }
  return context;
};

interface AnnotationProviderProps {
  children: React.ReactNode;
}

export const AnnotationProvider: React.FC<AnnotationProviderProps> = ({ children }) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnnotations = useCallback(async (type?: 'favorites' | 'notes') => {
    try {
      setLoading(true);
      setError(null);
      
      const annotationsData = await annotationApi.getAnnotations(type);
      setAnnotations(annotationsData.annotations || []);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des annotations');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAnnotation = useCallback(async (verseId: number, data: Partial<Annotation>) => {
    try {
      setLoading(true);
      setError(null);
      
      const newAnnotation = await annotationApi.createAnnotation({
        verse_id: verseId,
        note: data.note || '',
        color: data.color || '#fbbf24',
        is_favorite: data.is_favorite || false
      });
      
      setAnnotations(prev => [newAnnotation, ...prev]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'annotation');
      throw err; // Re-throw pour que le composant puisse gérer l'erreur
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAnnotation = useCallback(async (id: number, data: Partial<Annotation>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedAnnotation = await annotationApi.updateAnnotation(id, {
        note: data.note,
        color: data.color,
        is_favorite: data.is_favorite
      });
      
      setAnnotations(prev => 
        prev.map(annotation => 
          annotation.id === id ? updatedAnnotation : annotation
        )
      );
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'annotation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAnnotation = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      await annotationApi.deleteAnnotation(id);
      
      setAnnotations(prev => prev.filter(annotation => annotation.id !== id));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'annotation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getVerseAnnotation = useCallback((verseId: number): Annotation | null => {
    return annotations.find(annotation => annotation.verse_id === verseId) || null;
  }, [annotations]);

  const value: AnnotationContextType = {
    annotations,
    loading,
    error,
    loadAnnotations,
    createAnnotation,
    updateAnnotation,
    deleteAnnotation,
    getVerseAnnotation
  };

  return (
    <AnnotationContext.Provider value={value}>
      {children}
    </AnnotationContext.Provider>
  );
};

