// Types pour l'application biblique MedLam

export interface Book {
  id: number;
  name: string;
  abbreviation: string;
  testament: 'Ancien' | 'Nouveau';
  book_order: number;
  chapter_count: number;
  created_at: string;
  chapters?: Chapter[];
}

export interface Chapter {
  id: number;
  book_id: number;
  chapter_number: number;
  verse_count: number;
  created_at: string;
}

export interface Verse {
  id: number;
  chapter_id: number;
  verse_number: number;
  text: string;
  created_at: string;
  // Données d'annotation (si présentes)
  note?: string;
  color?: string;
  is_favorite?: boolean;
}

export interface Annotation {
  id: number;
  verse_id: number;
  user_session: string;
  note: string;
  color: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  // Données du verset associé
  verse_number?: number;
  verse_text?: string;
  chapter_number?: number;
  book_name?: string;
  abbreviation?: string;
}

export interface SearchResult {
  id: number;
  verse_number: number;
  text: string;
  chapter_number: number;
  book_name: string;
  abbreviation: string;
  testament: string;
  highlighted_text: string;
}

export interface SearchResponse {
  success: boolean;
  data: {
    results: SearchResult[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
    query: {
      text: string;
      book?: string;
      testament?: string;
    };
  };
}

export interface ReadingPlan {
  id: number;
  name: string;
  description: string;
  duration_days: number;
  created_at: string;
}

export interface ReadingPlanStep {
  id: number;
  plan_id: number;
  day_number: number;
  book_id: number;
  start_chapter: number;
  end_chapter: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    results?: T[];
    annotations?: T[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  };
}

export interface BibleStats {
  books: number;
  chapters: number;
  verses: number;
  annotations: number;
}

export interface ChapterData {
  book: Book;
  chapter: Chapter;
  verses: Verse[];
}

// Types pour les contextes React
export interface BibleContextType {
  books: Book[];
  currentBook: Book | null;
  currentChapter: number;
  currentVerses: Verse[];
  loading: boolean;
  error: string | null;
  loadBooks: () => Promise<void>;
  loadChapter: (bookId: number, chapterNumber: number) => Promise<void>;
  setCurrentBook: (book: Book) => void;
  setCurrentChapter: (chapter: number) => void;
}

export interface SearchContextType {
  query: string;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  search: (query: string, filters?: SearchFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  clearResults: () => void;
}

export interface SearchFilters {
  book?: string;
  testament?: 'Ancien' | 'Nouveau';
  limit?: number;
  offset?: number;
}

export interface AnnotationContextType {
  annotations: Annotation[];
  loading: boolean;
  error: string | null;
  loadAnnotations: (type?: 'favorites' | 'notes') => Promise<void>;
  createAnnotation: (verseId: number, data: Partial<Annotation>) => Promise<void>;
  updateAnnotation: (id: number, data: Partial<Annotation>) => Promise<void>;
  deleteAnnotation: (id: number) => Promise<void>;
  getVerseAnnotation: (verseId: number) => Annotation | null;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Types pour les hooks
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

// Types pour les composants
export interface VerseComponentProps {
  verse: Verse;
  showNumber?: boolean;
  onAnnotate?: (verse: Verse) => void;
  onFavorite?: (verse: Verse) => void;
  className?: string;
}

export interface NavigationProps {
  books: Book[];
  currentBook: Book | null;
  currentChapter: number;
  onBookSelect: (book: Book) => void;
  onChapterSelect: (chapter: number) => void;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

// Types d'événements
export type VerseSelectEvent = {
  verse: Verse;
  book: Book;
  chapter: number;
};

export type AnnotationEvent = {
  type: 'create' | 'update' | 'delete';
  annotation: Annotation;
  verse: Verse;
};

