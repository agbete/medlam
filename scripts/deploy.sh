#!/bin/bash

# Script de déploiement pour MedLam
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-development}
PROJECT_NAME="medlam"

echo "🚀 Déploiement de MedLam en mode $ENVIRONMENT"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    log_error "Docker n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ] || [ ! -f "Dockerfile" ]; then
    log_error "Ce script doit être exécuté depuis la racine du projet MedLam"
    exit 1
fi

log_info "Arrêt des conteneurs existants..."
docker-compose down --remove-orphans || true

log_info "Nettoyage des images obsolètes..."
docker system prune -f

log_info "Construction de l'image Docker..."
if [ "$ENVIRONMENT" = "production" ]; then
    docker-compose --profile production build --no-cache
else
    docker-compose build --no-cache
fi

log_success "Image construite avec succès"

log_info "Démarrage des services..."
if [ "$ENVIRONMENT" = "production" ]; then
    docker-compose --profile production up -d
else
    docker-compose up -d
fi

# Attendre que les services soient prêts
log_info "Attente du démarrage des services..."
sleep 10

# Vérifier la santé de l'application
log_info "Vérification de la santé de l'application..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f -s http://localhost:3001/api/health > /dev/null; then
        log_success "Application démarrée avec succès!"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        log_error "L'application n'a pas pu démarrer dans les temps"
        docker-compose logs medlam
        exit 1
    fi
    
    log_info "Tentative $attempt/$max_attempts - En attente..."
    sleep 2
    ((attempt++))
done

# Afficher les informations de déploiement
log_success "🎉 Déploiement terminé avec succès!"
echo ""
echo "📊 Informations de déploiement:"
echo "  - Environnement: $ENVIRONMENT"
echo "  - API Backend: http://localhost:3001"
echo "  - Santé de l'API: http://localhost:3001/api/health"

if [ "$ENVIRONMENT" = "production" ]; then
    echo "  - Frontend: http://localhost (via Nginx)"
else
    echo "  - Frontend: Servir manuellement depuis frontend/build/"
fi

echo ""
echo "📋 Commandes utiles:"
echo "  - Voir les logs: docker-compose logs -f"
echo "  - Arrêter: docker-compose down"
echo "  - Redémarrer: docker-compose restart"
echo "  - Shell dans le conteneur: docker-compose exec medlam sh"

# Afficher les logs récents
log_info "Logs récents:"
docker-compose logs --tail=20 medlam

