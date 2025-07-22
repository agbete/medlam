import React, { createContext, useContext, useState, useCallback } from 'react';
import { Book, Verse, BibleContextType } from '../types';
import { bibleApi } from '../utils/api';

const BibleContext = createContext<BibleContextType | undefined>(undefined);

export const useBible = () => {
  const context = useContext(BibleContext);
  if (!context) {
    throw new Error('useBible must be used within a BibleProvider');
  }
  return context;
};

interface BibleProviderProps {
  children: React.ReactNode;
}

export const BibleProvider: React.FC<BibleProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [currentVerses, setCurrentVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const booksData = await bibleApi.getBooks();
      setBooks(booksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des livres');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadChapter = useCallback(async (bookId: number, chapterNumber: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const chapterData = await bibleApi.getChapter(bookId, chapterNumber);
      
      setCurrentBook(chapterData.book);
      setCurrentChapter(chapterNumber);
      setCurrentVerses(chapterData.verses);
      
      // Mettre à jour le livre dans la liste si nécessaire
      setBooks(prevBooks => {
        const bookIndex = prevBooks.findIndex(b => b.id === bookId);
        if (bookIndex === -1) {
          return [...prevBooks, chapterData.book];
        }
        return prevBooks;
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du chapitre');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSetCurrentBook = useCallback((book: Book) => {
    setCurrentBook(book);
    // Réinitialiser au chapitre 1 quand on change de livre
    setCurrentChapter(1);
    setCurrentVerses([]);
  }, []);

  const handleSetCurrentChapter = useCallback((chapter: number) => {
    setCurrentChapter(chapter);
    // Charger automatiquement le chapitre si on a un livre sélectionné
    if (currentBook) {
      loadChapter(currentBook.id, chapter);
    }
  }, [currentBook, loadChapter]);

  const value: BibleContextType = {
    books,
    currentBook,
    currentChapter,
    currentVerses,
    loading,
    error,
    loadBooks,
    loadChapter,
    setCurrentBook: handleSetCurrentBook,
    setCurrentChapter: handleSetCurrentChapter
  };

  return (
    <BibleContext.Provider value={value}>
      {children}
    </BibleContext.Provider>
  );
};

