import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Heart, 
  Shuffle,
  BarChart3,
  ArrowRight,
  Star
} from 'lucide-react';
import { bibleApi } from '../utils/api';
import { BibleStats } from '../types';

const HomePage: React.FC = () => {
  const [stats, setStats] = useState<BibleStats | null>(null);
  const [randomVerse, setRandomVerse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, verseData] = await Promise.all([
          bibleApi.getStats(),
          bibleApi.getRandomVerse()
        ]);
        setStats(statsData);
        setRandomVerse(verseData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: 'Lecture de la Bible',
      description: 'Lisez les Écritures dans une interface moderne et intuitive',
      href: '/bible',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Search,
      title: 'Recherche avancée',
      description: 'Trouvez rapidement des versets par mots-clés ou thèmes',
      href: '/search',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Heart,
      title: 'Annotations personnelles',
      description: 'Prenez des notes et marquez vos versets favoris',
      href: '/annotations',
      color: 'text-red-600 dark:text-red-400'
    }
  ];

  const getNewRandomVerse = async () => {
    try {
      const verseData = await bibleApi.getRandomVerse();
      setRandomVerse(verseData);
    } catch (error) {
      console.error('Erreur lors du chargement du verset:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Bienvenue sur{' '}
              <span className="text-primary-600 dark:text-primary-400">MedLam</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Votre compagnon moderne pour la lecture et l'étude de la Bible. 
              Découvrez les Écritures avec des outils puissants et une interface intuitive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/bible"
                className="btn btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
              >
                <BookOpen className="h-5 w-5" />
                <span>Commencer la lecture</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/search"
                className="btn btn-secondary text-lg px-8 py-3 inline-flex items-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Rechercher</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Fonctionnalités principales
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Découvrez tous les outils disponibles pour enrichir votre étude biblique
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={index}
                  to={feature.href}
                  className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <div className="card-body text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Random Verse Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Verset du jour
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Laissez-vous inspirer par la Parole de Dieu
            </p>
          </div>

          {loading ? (
            <div className="card">
              <div className="card-body text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-300 mt-4">Chargement...</p>
              </div>
            </div>
          ) : randomVerse ? (
            <div className="card">
              <div className="card-body text-center py-12">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-6" />
                <blockquote className="text-xl md:text-2xl font-serif text-gray-900 dark:text-white mb-6 leading-relaxed">
                  "{randomVerse.text}"
                </blockquote>
                <cite className="text-lg font-medium text-primary-600 dark:text-primary-400">
                  {randomVerse.book_name} {randomVerse.chapter_number}:{randomVerse.verse_number}
                </cite>
                <div className="mt-8">
                  <button
                    onClick={getNewRandomVerse}
                    className="btn btn-ghost inline-flex items-center space-x-2"
                  >
                    <Shuffle className="h-4 w-4" />
                    <span>Nouveau verset</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center py-12">
                <p className="text-gray-600 dark:text-gray-300">
                  Impossible de charger le verset du jour
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Contenu disponible
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Explorez la richesse des Écritures
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stats.books}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Livres</div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                  <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stats.chapters}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Chapitres</div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
                  <Search className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stats.verses}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Versets</div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                  <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stats.annotations}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Annotations</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 dark:bg-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à commencer votre étude ?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Rejoignez des milliers de personnes qui utilisent MedLam pour approfondir leur foi
          </p>
          <Link
            to="/bible"
            className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3 inline-flex items-center space-x-2"
          >
            <BookOpen className="h-5 w-5" />
            <span>Commencer maintenant</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

