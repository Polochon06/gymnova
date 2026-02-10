# 📖 GUIDE D'INSTALLATION DÉTAILLÉ - GYMNOVA SHOP

Ce guide vous accompagne étape par étape dans l'installation et le lancement du projet Gymnova Shop.

## 🎯 Ce dont vous avez besoin

### Logiciels à installer

1. **Node.js** (v16 ou plus récent)
   - Télécharger : https://nodejs.org/
   - Vérifier l'installation : `node --version` et `npm --version`

2. **MySQL** (v8 ou plus récent)
   - Windows : https://dev.mysql.com/downloads/installer/
   - Mac : https://dev.mysql.com/downloads/mysql/
   - Ou utiliser XAMPP/WAMP qui inclut MySQL

3. **Un éditeur de code** (recommandé)
   - Visual Studio Code : https://code.visualstudio.com/

4. **Git** (optionnel mais recommandé)
   - https://git-scm.com/downloads

## 📥 ÉTAPE 1 : Préparation

### 1.1 Extraire le projet
```bash
# Si vous avez un fichier zip, extrayez-le
# Vous devriez avoir un dossier "gymnova-shop"
```

### 1.2 Ouvrir le terminal
- **Windows** : PowerShell ou CMD
- **Mac/Linux** : Terminal

### 1.3 Naviguer vers le projet
```bash
cd chemin/vers/gymnova-shop
```

## 💾 ÉTAPE 2 : Configuration de la Base de Données

### 2.1 Démarrer MySQL

**Avec XAMPP/WAMP :**
- Ouvrir le panneau de contrôle
- Démarrer le service MySQL

**MySQL seul :**
```bash
# Windows
net start MySQL80

# Mac
mysql.server start

# Linux
sudo service mysql start
```

### 2.2 Créer la base de données

```bash
# Se connecter à MySQL
mysql -u root -p
# (Entrer votre mot de passe MySQL)
```

Puis exécuter ces commandes SQL :

```sql
-- Créer la base de données
CREATE DATABASE gymnova_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Sélectionner la base
USE gymnova_shop;

-- Importer le schéma (quitter mysql d'abord avec \q)
```

Puis dans le terminal :
```bash
mysql -u root -p gymnova_shop < database/schema.sql
```

### 2.3 Vérifier l'importation

```bash
mysql -u root -p

USE gymnova_shop;
SHOW TABLES;
# Vous devriez voir : users, products, categories, cart, orders, etc.

SELECT * FROM products;
# Vous devriez voir des produits d'exemple

\q
```

## 🔧 ÉTAPE 3 : Configuration du Backend

### 3.1 Aller dans le dossier backend
```bash
cd backend
```

### 3.2 Installer les dépendances
```bash
npm install
```
⏱️ *Patience, cela peut prendre 1-2 minutes*

### 3.3 Configurer les variables d'environnement

**Windows :**
```bash
copy .env.example .env
notepad .env
```

**Mac/Linux :**
```bash
cp .env.example .env
nano .env
# ou : open .env
```

**Éditer le fichier .env :**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=gymnova_shop
DB_PORT=3306

PORT=5000
NODE_ENV=development

JWT_SECRET=mon_super_secret_jwt_tres_securise_123456

# Pour plus tard (Stripe en mode test)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

FRONTEND_URL=http://localhost:3000
```

**⚠️ Important :**
- Remplacez `votre_mot_de_passe_mysql` par votre mot de passe MySQL
- Le `JWT_SECRET` doit être une chaîne aléatoire longue et sécurisée
- Les clés Stripe sont optionnelles pour commencer

### 3.4 Tester le backend
```bash
npm run dev
```

✅ **Succès si vous voyez :**
```
🚀 Serveur démarré sur le port 5000
✅ Connecté à la base de données MySQL
```

❌ **Erreur de connexion BDD ?**
- Vérifiez que MySQL est démarré
- Vérifiez votre mot de passe dans le .env
- Vérifiez le nom de la base de données

**Laisser ce terminal ouvert !** Le backend doit rester actif.

## 🎨 ÉTAPE 4 : Configuration du Frontend

### 4.1 Ouvrir un NOUVEAU terminal
*Ne fermez pas le terminal du backend !*

### 4.2 Aller dans le dossier frontend
```bash
cd chemin/vers/gymnova-shop/frontend
```

### 4.3 Installer les dépendances
```bash
npm install
```
⏱️ *Patience, cela peut prendre 2-3 minutes*

### 4.4 Configurer les variables d'environnement

**Windows :**
```bash
copy .env.example .env
notepad .env
```

**Mac/Linux :**
```bash
cp .env.example .env
nano .env
```

**Éditer le fichier .env :**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4.5 Démarrer l'application React
```bash
npm start
```

✅ **Succès si :**
- Le navigateur s'ouvre automatiquement sur http://localhost:3000
- Vous voyez la page d'accueil Gymnova Shop
- Pas d'erreurs dans la console

## 🎉 ÉTAPE 5 : Tester l'Application

### 5.1 Créer un compte
1. Cliquer sur "Inscription"
2. Remplir le formulaire
3. Soumettre
4. Vous serez redirigé vers la page de connexion

### 5.2 Se connecter
1. Cliquer sur "Connexion"
2. Entrer vos identifiants
3. Soumettre

### 5.3 Tester le catalogue
1. Aller sur "Produits"
2. Filtrer par catégorie
3. Cliquer sur un produit
4. Ajouter au panier
5. Voir votre panier

### 5.4 Vérifier le panier
1. Cliquer sur "Panier"
2. Modifier les quantités
3. Supprimer des articles
4. Voir le total

## ❓ Problèmes Courants

### Problème : "Port 3000 is already in use"
**Solution :**
```bash
# Tuer le processus sur le port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Problème : "Cannot connect to database"
**Solutions :**
1. Vérifier que MySQL est démarré
2. Vérifier le mot de passe dans .env
3. Vérifier que la base gymnova_shop existe
4. Tester la connexion :
```bash
mysql -u root -p -e "USE gymnova_shop; SELECT COUNT(*) FROM products;"
```

### Problème : "Module not found"
**Solution :**
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Problème : Page blanche sur localhost:3000
**Solutions :**
1. Vérifier la console du navigateur (F12)
2. Vérifier que le backend est actif (localhost:5000)
3. Vérifier le fichier .env du frontend
4. Effacer le cache du navigateur (Ctrl+Shift+R)

## 🔐 Configuration Stripe (Optionnel)

Pour tester les paiements :

1. Créer un compte Stripe : https://stripe.com/
2. Aller dans : Developers > API Keys
3. Copier les clés de test (commencent par `sk_test_` et `pk_test_`)
4. Les ajouter dans les fichiers .env :
   - Backend : `STRIPE_SECRET_KEY`
   - Frontend : `REACT_APP_STRIPE_PUBLISHABLE_KEY`
5. Redémarrer les deux serveurs

**Carte de test Stripe :**
- Numéro : 4242 4242 4242 4242
- Date : n'importe quelle date future
- CVC : n'importe quel 3 chiffres

## 🚀 Commandes Utiles

### Backend
```bash
cd backend
npm run dev          # Démarrage avec rechargement auto
npm start            # Démarrage production
```

### Frontend
```bash
cd frontend
npm start            # Démarrage développement
npm run build        # Build production
```

### Base de données
```bash
# Sauvegarder
mysqldump -u root -p gymnova_shop > backup.sql

# Restaurer
mysql -u root -p gymnova_shop < backup.sql

# Reset
mysql -u root -p gymnova_shop < database/schema.sql
```

## 📞 Aide Supplémentaire

Si vous rencontrez toujours des problèmes :

1. **Vérifier les logs :**
   - Terminal backend : messages d'erreur détaillés
   - Console navigateur (F12) : erreurs frontend

2. **Vérifier les versions :**
   ```bash
   node --version    # v16 ou supérieur
   npm --version     # 8 ou supérieur
   mysql --version   # 8 ou supérieur
   ```

3. **Réinstallation complète :**
   ```bash
   # Backend
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   
   # Frontend
   cd ../frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

## ✅ Checklist Finale

Avant de commencer à développer, vérifiez :

- [ ] MySQL est démarré et accessible
- [ ] La base gymnova_shop existe avec des données
- [ ] Backend démarre sans erreur sur port 5000
- [ ] Frontend démarre sans erreur sur port 3000
- [ ] Vous pouvez créer un compte et vous connecter
- [ ] Vous pouvez voir les produits
- [ ] Vous pouvez ajouter des produits au panier
- [ ] Les deux fichiers .env sont configurés

## 🎓 Prêt à coder !

Votre environnement est maintenant prêt. Bon développement ! 🚀

Pour toute question, consultez :
- README.md (documentation générale)
- Les commentaires dans le code
- La documentation des technologies utilisées
