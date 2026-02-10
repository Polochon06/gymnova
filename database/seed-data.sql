-- =============================================
-- GYMNOVA SHOP - SEED DATA
-- Run this script to add users and products
-- =============================================

-- =============================================
-- USERS (password for all: "password123")
-- =============================================

INSERT INTO `users` (`email`, `password`, `nom`, `prenom`, `telephone`, `role`) VALUES
-- Admin users
('admin@gymnova.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Johnson', 'Michael', '+1-555-0100', 'admin'),
('manager@gymnova.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Williams', 'Sarah', '+1-555-0101', 'admin'),

-- Client users
('john.doe@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Doe', 'John', '+1-555-0102', 'client'),
('jane.smith@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Smith', 'Jane', '+1-555-0103', 'client'),
('coach.miller@gym.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Miller', 'Robert', '+1-555-0104', 'client'),
('olympic.training@sports.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Anderson', 'Emily', '+1-555-0105', 'client'),
('school.gym@education.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Brown', 'David', '+1-555-0106', 'client'),
('fitness.center@health.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Taylor', 'Lisa', '+1-555-0107', 'client'),
('pro.athlete@sports.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Garcia', 'Carlos', '+1-555-0108', 'client'),
('home.gym@personal.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Martinez', 'Sofia', '+1-555-0109', 'client');

-- =============================================
-- ADDITIONAL PROFESSIONAL PRODUCTS
-- =============================================

INSERT INTO `products` (`nom`, `description`, `prix`, `stock`, `categorie_id`, `image_url`) VALUES

-- FLOOR MATS (category 1)
('Competition Floor 12m x 12m', 'FIG certified competition floor exercise area with springs, complete with carpet', 15999.00, 2, 1, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'),
('Tumbling Track 15m', 'Professional tumbling track with foam and springs for power tumbling', 8999.00, 3, 1, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400'),
('Air Track Inflatable 6m', 'Inflatable air track for safe tumbling practice, includes pump', 699.99, 15, 1, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400'),
('Crash Mat 2m x 1.5m', 'Extra thick crash mat 30cm foam for dismount training', 449.99, 12, 1, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),
('Panel Mat Set (10 pieces)', 'Interlocking panel mats for floor coverage, 2m x 1m each', 899.99, 8, 1, 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400'),

-- BALANCE BEAMS (category 2)
('AAI Elite Balance Beam', 'World-class competition beam, suede covering, adjustable 80-120cm', 2499.00, 4, 2, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'),
('Beam Training System', 'Complete beam system with low, medium, and high beam options', 3299.00, 3, 2, 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400'),
('Portable Practice Beam', 'Lightweight portable beam for home training, foldable design', 199.99, 25, 2, 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400'),
('Beam Pad Cover Set', 'Protective padding for beam training, set of 3 covers', 79.99, 40, 2, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'),

-- BARS (category 3)
('Spieth Competition Uneven Bars', 'Olympic-level uneven bars, FIG certified, fiberglass rails', 5999.00, 2, 3, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'),
('Men''s High Bar Competition', 'Competition horizontal bar 2.8m height, steel construction', 3499.00, 3, 3, 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'),
('Men''s Parallel Bars', 'FIG certified parallel bars, adjustable height and width', 4299.00, 3, 3, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),
('Kip Bar Home Training', 'Adjustable home training bar for kip practice, 1m-1.5m', 349.99, 20, 3, 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400'),
('Rail Grip Spray', 'Professional grip spray for bars, competition approved', 24.99, 100, 3, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'),

-- TRAMPOLINES (category 4)
('Eurotramp Grand Master', 'World championship level trampoline, 5x3m bed, 4mm webbing', 12999.00, 2, 4, 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400'),
('Tumbl Trak Tumbling', 'Tumbling trampoline for running tumbling drills', 2999.00, 5, 4, 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'),
('Safety End Decks (pair)', 'Padded end decks for competition trampolines', 1499.00, 8, 4, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),
('Trampoline Frame Pads', 'Replacement safety pads for competition trampolines', 399.99, 15, 4, 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400'),

-- RINGS (category 5)
('Olympic Ring System Complete', 'Complete ring setup with frame, cables, and competition rings', 4999.00, 3, 5, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400'),
('Adjustable Ring Straps', 'Competition straps with quick adjustment system, pair', 199.99, 25, 5, 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'),
('Ring Training Tower', 'Portable ring tower for training, adjustable height 2-3m', 1299.00, 6, 5, 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400'),

-- POMMEL HORSE (category 6)
('Spieth Ergostar Pommel Horse', 'Top competition pommel horse, adjustable handles', 3299.00, 3, 6, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'),
('Pommel Horse Trainer Handles', 'Replacement handles for pommel horse, competition spec', 299.99, 20, 6, 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400'),
('Mushroom Pommel Trainer Pro', 'Large diameter mushroom for advanced circle training', 599.99, 10, 6, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400'),
('Travel Pommel Buck', 'Compact pommel apparatus for travel and limited space', 799.99, 8, 6, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),

-- VAULT (category 7)
('AAI Elite Vault Table', 'Latest generation vault table, micro-adjust spring system', 3499.00, 4, 7, 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400'),
('Vault Board - Reuther Style', 'Competition vault springboard, adjustable spring tension', 799.99, 10, 7, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),
('Vault Runway 25m', 'Competition vault runway with lane markings', 2999.00, 3, 7, 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'),
('Training Vault Stack System', 'Adjustable vault training system, foam modules', 1199.00, 6, 7, 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400'),

-- ACCESSORIES (category 8)
('Liquid Chalk 250ml', 'Long-lasting liquid chalk, competition approved', 18.99, 150, 8, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'),
('Chalk Bowl with Rosin', 'Chalk bowl with built-in rosin block', 34.99, 80, 8, 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'),
('Competition Grips Men', 'Professional dowel grips for high bar, various sizes', 89.99, 60, 8, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
('Competition Grips Women', 'Professional uneven bar grips, various sizes', 79.99, 60, 8, 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400'),
('Tiger Paws Wrist Supports', 'Popular wrist support for training, pair', 44.99, 50, 8, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400'),
('Ankle Supports Pro', 'Professional ankle supports, compression fit', 29.99, 70, 8, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'),
('Grip Balm Tin', 'Natural grip balm for hand care, 60g', 12.99, 100, 8, 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'),
('Equipment Bag XL', 'Extra large wheeled equipment bag for competitions', 149.99, 30, 8, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
('Grip Brush Set', 'Brass and nylon grip brushes for maintenance, set of 3', 19.99, 80, 8, 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400'),
('Competition Leotard Elite', 'Team USA style competition leotard with crystals', 189.99, 25, 8, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400'),
('Practice Shorts Set', 'Comfortable practice shorts, pack of 3', 49.99, 60, 8, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),
('Beam Shoes', 'Split-sole beam shoes for better grip', 39.99, 45, 8, 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400');

-- =============================================
-- SAMPLE ADDRESSES
-- =============================================

INSERT INTO `addresses` (`user_id`, `nom`, `adresse`, `code_postal`, `ville`, `pays`, `telephone`, `par_defaut`) VALUES
(3, 'Home', '123 Main Street', '10001', 'New York', 'USA', '+1-555-0102', TRUE),
(3, 'Work', '456 Office Blvd', '10002', 'New York', 'USA', '+1-555-0102', FALSE),
(4, 'Home', '789 Oak Avenue', '90210', 'Los Angeles', 'USA', '+1-555-0103', TRUE),
(5, 'Gym Address', '321 Training Center Dr', '60601', 'Chicago', 'USA', '+1-555-0104', TRUE),
(6, 'Olympic Center', '555 Gold Medal Way', '80202', 'Denver', 'USA', '+1-555-0105', TRUE);

-- =============================================
-- SAMPLE REVIEWS
-- =============================================

INSERT INTO `reviews` (`user_id`, `product_id`, `note`, `commentaire`) VALUES
(3, 1, 5, 'Excellent quality mat! Perfect for home training.'),
(4, 1, 4, 'Good thickness, very durable. Shipping was fast.'),
(5, 4, 5, 'My students love this beam. Great for beginners.'),
(6, 7, 5, 'Professional quality bar at a reasonable price.'),
(3, 13, 5, 'Best rings I have ever used. FIG certified quality.'),
(4, 16, 4, 'Great pommel horse for training. Handles are perfect.'),
(5, 10, 5, 'Competition quality trampoline. Worth every penny.'),
(7, 23, 5, 'Perfect chalk, lasts all session. Highly recommend.'),
(8, 24, 4, 'Good grips, comfortable fit. Will buy again.');

SELECT 'Seed data imported successfully!' AS Status;
SELECT CONCAT('Total users: ', COUNT(*)) AS Users FROM users;
SELECT CONCAT('Total products: ', COUNT(*)) AS Products FROM products;
SELECT CONCAT('Total reviews: ', COUNT(*)) AS Reviews FROM reviews;