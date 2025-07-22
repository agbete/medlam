# Dockerfile multi-stage pour l'application MedLam

# Stage 1: Build du frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copier les fichiers de dépendances
COPY frontend/package*.json ./
RUN npm ci --only=production

# Copier le code source du frontend
COPY frontend/ ./

# Build du frontend
RUN npm run build

# Stage 2: Setup du backend
FROM node:18-alpine AS backend-setup

WORKDIR /app/backend

# Installer les dépendances système nécessaires pour SQLite
RUN apk add --no-cache python3 make g++ sqlite

# Copier les fichiers de dépendances du backend
COPY backend/package*.json ./
RUN npm ci --only=production

# Copier le code source du backend
COPY backend/ ./

# Stage 3: Image finale
FROM node:18-alpine AS production

# Installer SQLite
RUN apk add --no-cache sqlite

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S medlam -u 1001

WORKDIR /app

# Copier le backend depuis le stage précédent
COPY --from=backend-setup --chown=medlam:nodejs /app/backend ./backend

# Copier le frontend build
COPY --from=frontend-builder --chown=medlam:nodejs /app/frontend/build ./frontend/build

# Créer les dossiers nécessaires
RUN mkdir -p /app/backend/database && chown -R medlam:nodejs /app/backend/database
RUN mkdir -p /app/logs && chown -R medlam:nodejs /app/logs

# Changer vers l'utilisateur non-root
USER medlam

# Exposer le port
EXPOSE 3001

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_PATH=/app/backend/database/medlam.db

# Script de démarrage
COPY --chown=medlam:nodejs scripts/docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

# Commande de démarrage
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "start"]

# Métadonnées
LABEL maintainer="MedLam Team"
LABEL description="Application Web biblique moderne"
LABEL version="1.0.0"

