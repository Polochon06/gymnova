-- Schema Gymnova Shop
-- Base de données pour e-commerce de matériel de gymnastique

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Supprimer les tables existantes
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `addresses`;
DROP TABLE IF EXISTS `users`;

-- Table des utilisateurs
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `nom` VARCHAR(100) NOT NULL,
  `prenom` VARCHAR(100) NOT NULL,
  `telephone` VARCHAR(20),
  `role` ENUM('client', 'admin') DEFAULT 'client',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des adresses
CREATE TABLE `addresses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `nom` VARCHAR(100) NOT NULL,
  `adresse` VARCHAR(255) NOT NULL,
  `code_postal` VARCHAR(10) NOT NULL,
  `ville` VARCHAR(100) NOT NULL,
  `pays` VARCHAR(100) DEFAULT 'France',
  `telephone` VARCHAR(20),
  `par_defaut` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des catégories
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nom` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `image_url` VARCHAR(500),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des produits
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nom` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `prix` DECIMAL(10, 2) NOT NULL,
  `stock` INT DEFAULT 0,
  `categorie_id` INT,
  `image_url` VARCHAR(500),
  `actif` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`categorie_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des images produits supplémentaires
CREATE TABLE `product_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `ordre` INT DEFAULT 0,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table du panier
CREATE TABLE `cart` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantite` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_cart_item` (`user_id`, `product_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des commandes
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `total` DECIMAL(10, 2) NOT NULL,
  `statut` ENUM('en_attente', 'payee', 'en_preparation', 'expediee', 'livree', 'annulee') DEFAULT 'en_attente',
  `adresse_livraison` TEXT,
  `stripe_payment_id` VARCHAR(255),
  `payment_status` ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des items de commande
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantite` INT NOT NULL,
  `prix_unitaire` DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des avis
CREATE TABLE `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `note` INT NOT NULL,
  `commentaire` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_review` (`user_id`, `product_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- DONNÉES DE DÉMONSTRATION
-- =============================================

-- Utilisateurs (IMPORTANT: utilisez setup-db.js pour les bons mots de passe hashés)
INSERT INTO `users` (`email`, `password`, `nom`, `prenom`, `role`) VALUES
('admin@gymnova.com', '$2a$10$rPiVOlL7qLy8jfR5Kz5yxOPFBFz9p5vQjSzLcXGqT1ZE5U5GXHS5K', 'Admin', 'Gymnova', 'admin'),
('user@test.com', '$2a$10$rPiVOlL7qLy8jfR5Kz5yxOPFBFz9p5vQjSzLcXGqT1ZE5U5GXHS5K', 'Test', 'User', 'client');

-- Categories avec images placeholder
INSERT INTO `categories` (`nom`, `description`, `image_url`) VALUES
('Floor Mats', 'Professional gymnastics mats for floor training', 'https://placehold.co/400x300/e74c3c/ffffff?text=Floor+Mats'),
('Balance Beams', 'Balance beams for all skill levels', 'https://placehold.co/400x300/3498db/ffffff?text=Balance+Beams'),
('Bars', 'Uneven bars and horizontal bars', 'https://placehold.co/400x300/2ecc71/ffffff?text=Bars'),
('Trampolines', 'Professional and recreational trampolines', 'https://placehold.co/400x300/9b59b6/ffffff?text=Trampolines'),
('Rings', 'Gymnastics rings and accessories', 'https://placehold.co/400x300/f39c12/ffffff?text=Rings'),
('Pommel Horse', 'Pommel horses for artistic gymnastics', 'https://placehold.co/400x300/1abc9c/ffffff?text=Pommel+Horse'),
('Vault', 'Vaulting tables and springboards', 'https://placehold.co/400x300/e67e22/ffffff?text=Vault'),
('Accessories', 'Complementary equipment and accessories', 'https://placehold.co/400x300/34495e/ffffff?text=Accessories');

-- Products avec images placeholder
INSERT INTO `products` (`nom`, `description`, `prix`, `stock`, `categorie_id`, `image_url`) VALUES
-- Floor Mats (categorie_id = 1)
('Floor Mat 2m x 1m', 'Professional gymnastics mat, 5cm thickness, high-density foam', 149.99, 25, 1, 'https://safetypadding.ie/wp-content/uploads/Sure-Shot-deluxe-Mat.jpg'),
('Landing Mat Competition', 'FIG certified landing mat, 20cm foam padding', 599.99, 10, 1, 'https://www.qdsanhong.com/uploads/202015547/gymnastic-tumbling-crash-mat56326678202.jpg'),
('Air Track Inflatable 6m', 'Inflatable air track for safe tumbling practice', 699.99, 12, 1, 'https://dropsite.com.au/media/catalog/product/cache/1/image/750x/040ec09b1e35df139433887a97daa66f/i/f/ifm-xbo-0601-bu-wt_10.jpg'),

-- Balance Beams (categorie_id = 2)
('Low Training Beam', 'Low balance beam for beginners, 30cm height', 89.99, 20, 2, 'https://i.3dmodels.org/uploads/preorder/spieth_gymnastics_training_beam_low_beam_/spieth_gymnastics_training_beam_low_beam__1000_0001.jpg'),
('Competition Beam', 'FIG certified competition beam, adjustable height', 1299.00, 5, 2, 'https://www.spieth-gymnastics.com/thumbnail/1e/de/42/1662981228/ec-munich-2022-07_3840x3840.JPG'),
('Practice Beam Floor Level', 'Floor-level beam for technique training', 149.99, 18, 2, 'https://www.gimtrac.co.za/wp-content/uploads/2021/02/2m-floor-beam-red-side-view-1024x1024.jpg'),

-- Bars (categorie_id = 3)
('Professional Uneven Bars', 'Professional uneven bars with cable tensioners', 2499.00, 3, 3, 'https://i.postimg.cc/J474tsQr/korean-gymnast-dohyun-eom-seen-in-action-during-the-gymnastics-world-cup-2019-at-the-john-cane-arena.jpg'),
('Training High Bar', 'Training high bar with adjustable height', 899.99, 8, 3, 'https://i.ytimg.com/vi/UosrHeNyAEk/maxresdefault.jpg'),
('Parallel Bars Pro', 'FIG certified parallel bars, adjustable height', 3499.00, 4, 3, 'https://i.postimg.cc/y8vVHLzM/liverpool-uk-9th-april-2016-sam-oldham-parallel-bars-mens-artistic-FX30HJ.jpg'),

-- Trampolines (categorie_id = 4)
('Mini Fitness Trampoline', '100cm mini trampoline for fitness and warm-up', 79.99, 30, 4, 'https://m.media-amazon.com/images/I/61HlauYP7uL._AC_SL1500_.jpg'),
('Competition Trampoline', '5m x 3m FIG certified competition trampoline', 4999.00, 2, 4, 'https://maxairtrampolines.com/product/7-x-14-folding-competition-trampoline/IMG_1379-copy.jpeg'),
('Double Mini Trampoline', 'Double mini tramp for tumbling training', 1299.99, 6, 4, 'https://www.gymnova.com/media/catalog/product/cache/918ba8e3dfe71395153a3970b4413383/2/3/23200-23201.png'),

-- Rings (categorie_id = 5)
('Pro Wood Rings', 'Premium wooden gymnastics rings with adjustable straps, competition grade', 149.99, 20, 5, 'https://cdn.kingsbox.com/assets/media/products/special-offer/used/X-075-1000-R--gymnastic-wood-rings--0.jpg'),
('Olympic Competition Rings', 'Official Olympic-style rings for professional training and competition', 4999.00, 15, 5, 'https://img.olympics.com/images/image/private/t_twitter_share_thumb/f_auto/primary/c8odo4mybjbca1q44jcj'),

-- Pommel Horse (categorie_id = 6)
('Competition Pommel Horse', 'FIG certified pommel horse with leather covering', 2299.00, 4, 6, 'https://global-uploads.webflow.com/5d655866b2055c7cbb5d79a1/6402549200a710240ede310c_022023_LarryMathewson031.webp'),
('Training Pommel Horse', 'Training pommel horse with synthetic leather', 1199.00, 7, 6, 'https://i.ytimg.com/vi/GEgcDfwD9Kk/maxresdefault.jpg'),
('Mushroom Trainer', 'Pommel mushroom for circle training', 399.99, 15, 6, 'https://www.amazon.com/images/I/81PspBEbwzL._AC_SL1500_._FMwebp_.jpg'),

-- Vault (categorie_id = 7)
('Competition Vault Table', 'FIG certified vaulting table with adjustable height', 2799.00, 3, 7, 'https://icdn.lenta.ru/images/2021/08/06/18/20210806181117116/preview_ee54b814149c97084913d0343e1778ca.jpg'),
('Training Vault Table', 'Training vault table for practice', 1499.00, 6, 7, 'https://image.made-in-china.com/2f0j00inkobwNRpBcC/Artistic-Gymnastics-Vault-Table-for-Training.jpg'),
('Springboard Competition', 'FIG certified springboard for vault', 599.99, 12, 7, 'https://i.postimg.cc/htmTdWtV/wmremove-transformed.jpg'),

-- Accessories (categorie_id = 8)
('Chalk Powder 500g', 'Pure magnesium carbonate for better grip', 12.99, 100, 8, 'https://i.ytimg.com/vi/ijhJVBtTkIE/maxresdefault.jpg'),
('Leather Grips', 'Genuine leather grips for bars', 34.99, 50, 8, 'https://m.media-amazon.com/images/I/61VjLy8nevL.jpg'),
('Gymnova Sports Bag', 'Spacious sports bag with compartments', 49.99, 40, 8, 'https://www.carlasport.ch/19806-large_default/-sac-de-sport-gymnastics-strass.jpg'),
('Wrist Supports', 'Elastic wrist supports for training', 19.99, 60, 8, 'https://contents.mediadecathlon.com/p1661359/k$db21c49ca780fd4c1f2f16353afc1e81/unisex-artistic-gymnastics-wrist-guards.jpg'),
('Training Leotard', 'Professional training leotard', 59.99, 45, 8, 'https://startner.com/1697-large_default/gymnastics-leotard-.jpg'),
('Competition Leotard', 'Team competition leotard with crystals', 189.99, 20, 8, 'https://i.pinimg.com/736x/ae/6c/b5/ae6cb59e0e1a9be226be29273ddbe406.jpg');

-- =============================================
-- IDENTIFIANTS DE CONNEXION
-- =============================================
-- Admin: admin@gymnova.com / admin123
-- User:  user@test.com / test123
--
-- NOTE: Les mots de passe hashés ci-dessus sont des placeholders.
-- Utilisez le script backend/scripts/setup-db.js pour créer
-- les utilisateurs avec les bons hash bcrypt.
-- =============================================