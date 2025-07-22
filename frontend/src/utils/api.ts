import axios from 'axios';
import { 
  Book, 
  ChapterData, 
  SearchResponse, 
  Annotation, 
  ApiResponse, 
  PaginatedResponse,
  BibleStats 
} from '../types';

// Configuration de base d'axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', error);
    
    if (error.response?.status === 404) {
      throw new Error('Ressource non trouvée');
    } else if (error.response?.status >= 500) {
      throw new Error('Erreur serveur, veuillez réessayer plus tard');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Délai d\'attente dépassé');
    } else {
      throw new Error(error.response?.data?.error || 'Une erreur est survenue');
    }
  }
);

// API pour les livres bibliques
export const bibleApi = {
  // Récupérer tous les livres
  getBooks: async (testament?: 'Ancien' | 'Nouveau'): Promise<Book[]> => {
    const params = testament ? { testament } : {};
    const response = await api.get<ApiResponse<Book[]>>('/bible/books', { params });
    return response.data.data;
  },

  // Récupérer un livre spécifique
  getBook: async (id: number): Promise<Book> => {
    const response = await api.get<ApiResponse<Book>>(`/bible/books/${id}`);
    return response.data.data;
  },

  // Récupérer un chapitre avec ses versets
  getChapter: async (bookId: number, chapterNumber: number): Promise<ChapterData> => {
    const response = await api.get<ApiResponse<ChapterData>>(
      `/bible/books/${bookId}/chapters/${chapterNumber}`
    );
    return response.data.data;
  },

  // Récupérer un verset aléatoire
  getRandomVerse: async () => {
    const response = await api.get('/bible/random');
    return response.data.data;
  },

  // Récupérer les statistiques
  getStats: async (): Promise<BibleStats> => {
    const response = await api.get<ApiResponse<BibleStats>>('/bible/stats');
    return response.data.data;
  }
};

// API pour la recherche
export const searchApi = {
  // Rechercher dans les versets
  search: async (
    query: string, 
    options: {
      book?: string;
      testament?: 'Ancien' | 'Nouveau';
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<SearchResponse['data']> => {
    const params = {
      q: query,
      ...options
    };
    
    const response = await api.get<SearchResponse>('/search', { params });
    return response.data.data;
  },

  // Récupérer des suggestions de recherche
  getSuggestions: async (query: string) => {
    const response = await api.get('/search/suggestions', {
      params: { q: query }
    });
    return response.data.data;
  },

  // Récupérer les termes populaires
  getPopularTerms: async () => {
    const response = await api.get('/search/popular');
    return response.data.data;
  }
};

// API pour les annotations
export const annotationApi = {
  // Récupérer toutes les annotations de l'utilisateur
  getAnnotations: async (
    type?: 'favorites' | 'notes',
    limit: number = 50,
    offset: number = 0
  ): Promise<PaginatedResponse<Annotation>['data']> => {
    const params = { type, limit, offset };
    const response = await api.get<PaginatedResponse<Annotation>>('/annotations', { params });
    return response.data.data;
  },

  // Créer une nouvelle annotation
  createAnnotation: async (data: {
    verse_id: number;
    note?: string;
    color?: string;
    is_favorite?: boolean;
  }): Promise<Annotation> => {
    const response = await api.post<ApiResponse<Annotation>>('/annotations', data);
    return response.data.data;
  },

  // Mettre à jour une annotation
  updateAnnotation: async (id: number, data: {
    note?: string;
    color?: string;
    is_favorite?: boolean;
  }): Promise<Annotation> => {
    const response = await api.put<ApiResponse<Annotation>>(`/annotations/${id}`, data);
    return response.data.data;
  },

  // Supprimer une annotation
  deleteAnnotation: async (id: number): Promise<void> => {
    await api.delete(`/annotations/${id}`);
  },

  // Récupérer l'annotation d'un verset spécifique
  getVerseAnnotation: async (verseId: number): Promise<Annotation | null> => {
    try {
      const response = await api.get<ApiResponse<Annotation | null>>(`/annotations/verse/${verseId}`);
      return response.data.data;
    } catch (error) {
      // Si pas d'annotation trouvée, retourner null
      return null;
    }
  }
};

// Fonction utilitaire pour vérifier la santé de l'API
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.data.status === 'OK';
  } catch (error) {
    return false;
  }
};

export default api;

