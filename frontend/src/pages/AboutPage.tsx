import React from 'react';
import { BookOpen, Heart, Search, Users, Shield, Zap } from 'lucide-react';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Lecture moderne',
      description: 'Interface intuitive et responsive pour une lecture confortable sur tous les appareils'
    },
    {
      icon: Search,
      title: 'Recherche puissante',
      description: 'Trouvez rapidement des versets grâce à notre moteur de recherche avancé'
    },
    {
      icon: Heart,
      title: 'Annotations personnelles',
      description: 'Prenez des notes, marquez vos favoris et personnalisez votre expérience'
    },
    {
      icon: Shield,
      title: 'Données sécurisées',
      description: 'Vos annotations sont stockées en toute sécurité et restent privées'
    },
    {
      icon: Zap,
      title: 'Performance optimale',
      description: 'Application rapide et réactive pour une expérience utilisateur fluide'
    },
    {
      icon: Users,
      title: 'Accessible à tous',
      description: 'Conçu pour être utilisable par tous, quel que soit le niveau technique'
    }
  ];

  const technologies = [
    { name: 'React', description: 'Interface utilisateur moderne' },
    { name: 'TypeScript', description: 'Code robuste et maintenable' },
    { name: 'Tailwind CSS', description: 'Design responsive et élégant' },
    { name: 'Node.js', description: 'Backend performant' },
    { name: 'SQLite', description: 'Base de données fiable' },
    { name: 'Express', description: 'API REST sécurisée' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary-100 dark:bg-primary-900 rounded-full">
            <BookOpen className="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          À propos de MedLam
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          MedLam est une application Web moderne conçue pour faciliter la lecture et l'étude de la Bible. 
          Notre mission est de rendre les Écritures accessibles à tous grâce à des outils numériques innovants.
        </p>
      </div>

      {/* Mission Section */}
      <section className="mb-16">
        <div className="card">
          <div className="card-body">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Notre Mission
            </h2>
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p>
                Dans un monde de plus en plus numérique, nous croyons que la Parole de Dieu doit être 
                accessible partout et à tout moment. MedLam combine la richesse des Écritures avec 
                les avantages de la technologie moderne pour offrir une expérience de lecture enrichissante.
              </p>
              <p>
                Que vous soyez un étudiant de la Bible expérimenté ou que vous découvriez les Écritures 
                pour la première fois, MedLam vous accompagne dans votre parcours spirituel avec des 
                outils adaptés à vos besoins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
          Fonctionnalités principales
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card">
                <div className="card-body text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 mb-4">
                    <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technology Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
          Technologies utilisées
        </h2>
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
              MedLam est construit avec des technologies modernes et éprouvées pour garantir 
              performance, sécurité et facilité d'utilisation.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technologies.map((tech, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {tech.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {tech.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="mb-16">
        <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-700">
          <div className="card-body text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Projet Open Source
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              MedLam est un projet open source. Nous croyons en la transparence et en la collaboration 
              pour créer des outils qui servent la communauté chrétienne mondiale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/agbete/medlam"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary inline-flex items-center space-x-2"
              >
                <span>Voir le code source</span>
              </a>
              <a
                href="https://github.com/agbete/medlam/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary inline-flex items-center space-x-2"
              >
                <span>Signaler un problème</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section>
        <div className="card">
          <div className="card-body text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Nous contacter
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Vous avez des questions, des suggestions ou souhaitez contribuer au projet ? 
              N'hésitez pas à nous contacter !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:contact@medlam.app"
                className="btn btn-ghost inline-flex items-center space-x-2"
              >
                <span>contact@medlam.app</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Version Info */}
      <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
        <p>MedLam v1.0.0 - Développé avec ❤️ pour la gloire de Dieu</p>
      </div>
    </div>
  );
};

export default AboutPage;

