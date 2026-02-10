# 🏋️ GYMNOVA SHOP - E-commerce Matériel de Gymnastique

Projet e-commerce complet développé dans le cadre du BTS SIO SLAM pour la vente de matériel professionnel de gymnastique.

## 🎯 Fonctionnalités

### Frontend (React)
- ✅ Page d'accueil avec hero section dynamique
- ✅ Catalogue de produits avec filtres (catégorie, niveau, recherche)
- ✅ Page détails produit avec gestion du stock
- ✅ Système d'authentification (inscription/connexion)
- ✅ Panier d'achat interactif
- ✅ Design responsive et athlétique
- ✅ Interface utilisateur moderne avec animations

### Backend (Node.js/Express)
- ✅ API RESTful complète
- ✅ Authentification JWT
- ✅ CRUD complet pour produits, panier, commandes
- ✅ Gestion des stocks en temps réel
- ✅ Intégration Stripe pour les paiements
- ✅ Middleware de sécurité
- ✅ Gestion des rôles (client/admin)

### Base de données (MySQL)
- ✅ Schéma normalisé
- ✅ Relations entre tables optimisées
- ✅ Données d'exemple incluses
- ✅ Gestion des transactions

## 📁 Structure du Projet

```
gymnova-shop/
├── backend/                # API Node.js/Express
│   ├── src/
│   │   ├── config/        # Configuration BDD
│   │   ├── controllers/   # Logique métier
│   │   ├── middleware/    # Middlewares (auth, etc.)
│   │   └── routes/        # Routes API
│   ├── server.js          # Point d'entrée serveur
│   ├── package.json
│   └── .env.example       # Variables d'environnement
│
├── frontend/              # Application React
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   ├── context/       # Contextes React
│   │   ├── config/        # Configuration API
│   │   ├── App.js         # Composant principal
│   │   ├── index.js       # Point d'entrée
│   │   └── index.css      # Styles globaux
│   ├── package.json
│   └── .env.example       # Variables d'environnement
│
└── database/
    └── schema.sql         # Schéma de la base de données
```

## 🚀 Installation et Configuration

### Prérequis
- Node.js (v16 ou supérieur)
- MySQL (v8 ou supérieur)
- npm ou yarn
- Compte Stripe (mode test)

### 1. Configuration de la Base de Données

```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE gymnova_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Utiliser la base de données
USE gymnova_shop;

# Importer le schéma
source /chemin/vers/gymnova-shop/database/schema.sql
```

### 2. Configuration du Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Copier et configurer les variables d'environnement
cp .env.example .env

# Éditer le fichier .env avec vos informations :
# - DB_HOST=localhost
# - DB_USER=root
# - DB_PASSWORD=votre_mot_de_passe
# - DB_NAME=gymnova_shop
# - JWT_SECRET=votre_secret_securise
# - STRIPE_SECRET_KEY=sk_test_votre_cle_stripe
```

### 3. Configuration du Frontend

```bash
# Aller dans le dossier frontend
cd ../frontend

# Installer les dépendances
npm install

# Copier et configurer les variables d'environnement
cp .env.example .env

# Éditer le fichier .env :
# - REACT_APP_API_URL=http://localhost:5000/api
# - REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_stripe
```

## 🎮 Lancement de l'Application

### Démarrer le Backend
```bash
cd backend
npm run dev
# Le serveur démarre sur http://localhost:5000
```

### Démarrer le Frontend
```bash
cd frontend
npm start
# L'application s'ouvre sur http://localhost:3000
```

## 🔐 Comptes de Test

Après avoir importé le schéma SQL, vous pouvez créer des comptes via l'interface d'inscription, ou insérer des utilisateurs de test :

```sql
-- Utilisateur client (mot de passe : password123)
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES ('client@test.com', '$2a$10$YourHashedPassword', 'John', 'Doe', 'client');

-- Utilisateur admin (mot de passe : admin123)
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES ('admin@test.com', '$2a$10$YourHashedPassword', 'Admin', 'User', 'admin');
```

## 📚 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur (protégé)

### Produits
- `GET /api/products` - Liste des produits (avec filtres)
- `GET /api/products/:id` - Détails d'un produit
- `GET /api/products/categories` - Liste des catégories
- `POST /api/products` - Créer un produit (admin)
- `PUT /api/products/:id` - Modifier un produit (admin)
- `DELETE /api/products/:id` - Supprimer un produit (admin)

### Panier
- `GET /api/cart` - Voir le panier (protégé)
- `POST /api/cart` - Ajouter au panier (protégé)
- `PUT /api/cart/:id` - Modifier quantité (protégé)
- `DELETE /api/cart/:id` - Retirer du panier (protégé)
- `DELETE /api/cart` - Vider le panier (protégé)

### Commandes
- `POST /api/orders` - Créer une commande (protégé)
- `GET /api/orders` - Liste des commandes (protégé)
- `GET /api/orders/:id` - Détails d'une commande (protégé)
- `POST /api/orders/confirm-payment` - Confirmer le paiement
- `PUT /api/orders/:id/cancel` - Annuler une commande (protégé)

## 🎨 Stack Technique

### Frontend
- **React 18** - Framework UI
- **React Router** - Navigation
- **Axios** - Requêtes HTTP
- **Stripe React** - Paiements
- **CSS Custom** - Design athlétique personnalisé

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MySQL2** - Driver base de données
- **JWT** - Authentification
- **Bcrypt** - Hashage des mots de passe
- **Stripe** - Traitement des paiements
- **CORS** - Gestion des origines croisées

### Base de Données
- **MySQL** - Base de données relationnelle
- Tables : users, products, categories, cart, orders, order_items, reviews, addresses

## 🔧 Développement

### Scripts Disponibles

**Backend :**
```bash
npm start      # Démarrer en production
npm run dev    # Démarrer avec nodemon (rechargement auto)
```

**Frontend :**
```bash
npm start      # Démarrer le serveur de développement
npm run build  # Créer un build de production
npm test       # Lancer les tests
```

## 🌟 Fonctionnalités Avancées à Implémenter

- [ ] Page de paiement Stripe complète
- [ ] Gestion des adresses de livraison
- [ ] Tableau de bord administrateur
- [ ] Historique des commandes avec suivi
- [ ] Système d'avis et notation des produits
- [ ] Filtres avancés (prix, disponibilité)
- [ ] Wishlist/Liste de souhaits
- [ ] Newsletter
- [ ] Mode sombre

## 📝 Notes Importantes

### Sécurité
- Les mots de passe sont hashés avec bcrypt (10 rounds)
- Les tokens JWT expirent après 24h
- Validation des données côté serveur
- Protection CORS configurée
- SQL injection prevention avec requêtes préparées

### Performance
- Pool de connexions MySQL
- Gestion optimisée du cache
- Images optimisées recommandées
- Code splitting avec React

### Tests
- Tester tous les endpoints avec Postman
- Vérifier les rôles utilisateur (client/admin)
- Tester les paiements en mode Stripe test
- Valider la gestion du stock

## 🎓 Objectifs Pédagogiques BTS SIO

Ce projet démontre les compétences suivantes :
- ✅ Conception et développement d'une application web full-stack
- ✅ Gestion de base de données relationnelle
- ✅ API RESTful et architecture MVC
- ✅ Authentification et autorisation
- ✅ Intégration de services tiers (Stripe)
- ✅ Responsive design et UX
- ✅ Gestion de projet et documentation

## 📞 Support

Pour toute question ou problème :
1. Vérifier que MySQL est démarré
2. Vérifier les variables d'environnement (.env)
3. Consulter les logs du serveur
4. Vérifier les ports (3000 pour React, 5000 pour Node)

## 📜 Licence

Projet éducatif - BTS SIO SLAM 2024

---

**Bon développement ! 🚀**
