import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useBible } from '../hooks/useBible';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

const BibleReaderPage: React.FC = () => {
  const { bookId, chapter } = useParams<{ bookId?: string; chapter?: string }>();
  const { 
    books, 
    currentBook, 
    currentChapter, 
    currentVerses, 
    loading, 
    error, 
    loadBooks, 
    loadChapter 
  } = useBible();

  useEffect(() => {
    if (books.length === 0) {
      loadBooks();
    }
  }, [books.length, loadBooks]);

  useEffect(() => {
    if (bookId && chapter) {
      loadChapter(parseInt(bookId), parseInt(chapter));
    } else if (books.length > 0 && !currentBook) {
      // Charger le premier livre par défaut (Genèse, chapitre 1)
      const firstBook = books.find(book => book.book_order === 1);
      if (firstBook) {
        loadChapter(firstBook.id, 1);
      }
    }
  }, [bookId, chapter, books, currentBook, loadChapter]);

  const navigateChapter = (direction: 'prev' | 'next') => {
    if (!currentBook) return;

    let newChapter = currentChapter;
    let newBook = currentBook;

    if (direction === 'next') {
      if (currentChapter < currentBook.chapter_count) {
        newChapter = currentChapter + 1;
      } else {
        // Passer au livre suivant
        const nextBook = books.find(book => book.book_order === currentBook.book_order + 1);
        if (nextBook) {
          newBook = nextBook;
          newChapter = 1;
        }
      }
    } else {
      if (currentChapter > 1) {
        newChapter = currentChapter - 1;
      } else {
        // Passer au livre précédent
        const prevBook = books.find(book => book.book_order === currentBook.book_order - 1);
        if (prevBook) {
          newBook = prevBook;
          newChapter = prevBook.chapter_count;
        }
      }
    }

    if (newBook.id !== currentBook.id || newChapter !== currentChapter) {
      loadChapter(newBook.id, newChapter);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <BookOpen className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {currentBook && (
        <>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {currentBook.name} {currentChapter}
              </h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateChapter('prev')}
                  className="btn btn-ghost p-2"
                  disabled={currentBook.book_order === 1 && currentChapter === 1}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-300 px-3">
                  Chapitre {currentChapter} / {currentBook.chapter_count}
                </span>
                <button
                  onClick={() => navigateChapter('next')}
                  className="btn btn-ghost p-2"
                  disabled={
                    currentBook.book_order === Math.max(...books.map(b => b.book_order)) &&
                    currentChapter === currentBook.chapter_count
                  }
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {currentBook.testament} Testament • {currentVerses.length} versets
            </div>
          </div>

          {/* Verses */}
          <div className="card">
            <div className="card-body">
              {currentVerses.length > 0 ? (
                <div className="space-y-4">
                  {currentVerses.map((verse) => (
                    <div key={verse.id} className="verse-container">
                      <p className="verse-text">
                        <span className="verse-number">{verse.verse_number}</span>
                        {verse.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Aucun verset disponible pour ce chapitre
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => navigateChapter('prev')}
              className="btn btn-secondary inline-flex items-center space-x-2"
              disabled={currentBook.book_order === 1 && currentChapter === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Précédent</span>
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {currentBook.name} {currentChapter}
              </p>
            </div>

            <button
              onClick={() => navigateChapter('next')}
              className="btn btn-secondary inline-flex items-center space-x-2"
              disabled={
                currentBook.book_order === Math.max(...books.map(b => b.book_order)) &&
                currentChapter === currentBook.chapter_count
              }
            >
              <span>Suivant</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BibleReaderPage;

