const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    });

    const dbName = process.env.DB_NAME || 'gymnova_bdd';

    console.log('🔧 Setting up Gymnova Shop Database...\n');

    try {
        // Create database if not exists
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await connection.query(`USE \`${dbName}\``);
        console.log(`✅ Database "${dbName}" ready`);

        // Drop existing tables
        await connection.query(`SET FOREIGN_KEY_CHECKS = 0`);
        await connection.query(`DROP TABLE IF EXISTS reviews, order_items, orders, cart, product_images, products, categories, addresses, users`);
        await connection.query(`SET FOREIGN_KEY_CHECKS = 1`);
        console.log('✅ Old tables dropped');

        // Create tables
        await connection.query(`
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                nom VARCHAR(100) NOT NULL,
                prenom VARCHAR(100) NOT NULL,
                telephone VARCHAR(20),
                role ENUM('client', 'admin') DEFAULT 'client',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        await connection.query(`
            CREATE TABLE categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nom VARCHAR(100) NOT NULL,
                description TEXT,
                image_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        await connection.query(`
            CREATE TABLE products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nom VARCHAR(255) NOT NULL,
                description TEXT,
                prix DECIMAL(10, 2) NOT NULL,
                stock INT DEFAULT 0,
                categorie_id INT,
                image_url VARCHAR(500),
                actif BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        await connection.query(`
            CREATE TABLE product_images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT NOT NULL,
                image_url VARCHAR(500) NOT NULL,
                ordre INT DEFAULT 0,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        await connection.query(`
            CREATE TABLE cart (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                product_id INT NOT NULL,
                quantite INT DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_cart_item (user_id, product_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        await connection.query(`
            CREATE TABLE orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                total DECIMAL(10, 2) NOT NULL,
                statut ENUM('en_attente', 'payee', 'en_preparation', 'expediee', 'livree', 'annulee') DEFAULT 'en_attente',
                adresse_livraison TEXT,
                stripe_payment_id VARCHAR(255),
                payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        await connection.query(`
            CREATE TABLE order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                quantite INT NOT NULL,
                prix_unitaire DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        console.log('✅ Tables created');

        // Create admin user with hashed password
        const adminPassword = await bcrypt.hash('admin123', 10);
        await connection.query(
            `INSERT INTO users (email, password, nom, prenom, role) VALUES (?, ?, ?, ?, ?)`,
            ['admin@gymnova.com', adminPassword, 'Admin', 'Gymnova', 'admin']
        );

        // Create test user
        const userPassword = await bcrypt.hash('test123', 10);
        await connection.query(
            `INSERT INTO users (email, password, nom, prenom, role) VALUES (?, ?, ?, ?, ?)`,
            ['user@test.com', userPassword, 'Test', 'User', 'client']
        );

        console.log('✅ Users created');
        console.log('   📧 Admin: admin@gymnova.com / admin123');
        console.log('   📧 User:  user@test.com / test123');

        // Insert categories with placeholder images
        await connection.query(`
            INSERT INTO categories (nom, description, image_url) VALUES
            ('Floor Mats', 'Professional gymnastics mats for floor training', 'https://placehold.co/400x300/e74c3c/ffffff?text=Floor+Mats'),
            ('Balance Beams', 'Balance beams for all skill levels', 'https://placehold.co/400x300/3498db/ffffff?text=Balance+Beams'),
            ('Bars', 'Uneven bars and horizontal bars', 'https://placehold.co/400x300/2ecc71/ffffff?text=Bars'),
            ('Trampolines', 'Professional and recreational trampolines', 'https://placehold.co/400x300/9b59b6/ffffff?text=Trampolines'),
            ('Rings', 'Gymnastics rings and accessories', 'https://placehold.co/400x300/f39c12/ffffff?text=Rings'),
            ('Pommel Horse', 'Pommel horses for artistic gymnastics', 'https://placehold.co/400x300/1abc9c/ffffff?text=Pommel+Horse'),
            ('Vault', 'Vaulting tables and springboards', 'https://placehold.co/400x300/e67e22/ffffff?text=Vault'),
            ('Accessories', 'Complementary equipment and accessories', 'https://placehold.co/400x300/34495e/ffffff?text=Accessories')
        `);
        console.log('✅ Categories created (8)');

        // Insert products with placeholder images
        await connection.query(`
            INSERT INTO products (nom, description, prix, stock, categorie_id, image_url) VALUES
            ('Floor Mat 2m x 1m', 'Professional gymnastics mat, 5cm thickness, high-density foam', 149.99, 25, 1, 'https://placehold.co/400x300/e74c3c/ffffff?text=Floor+Mat+2x1m'),
            ('Folding Mat 3m', 'Foldable mat in 4 sections, ideal for transport', 199.99, 15, 1, 'https://placehold.co/400x300/c0392b/ffffff?text=Folding+Mat+3m'),
            ('Landing Mat Competition', 'FIG certified landing mat, 20cm foam padding', 599.99, 10, 1, 'https://placehold.co/400x300/e74c3c/ffffff?text=Landing+Mat'),
            ('Air Track Inflatable 6m', 'Inflatable air track for safe tumbling practice', 699.99, 12, 1, 'https://placehold.co/400x300/c0392b/ffffff?text=Air+Track+6m'),

            ('Low Training Beam', 'Low balance beam for beginners, 30cm height', 89.99, 20, 2, 'https://placehold.co/400x300/3498db/ffffff?text=Training+Beam'),
            ('Competition Beam', 'FIG certified competition beam, adjustable height', 1299.00, 5, 2, 'https://placehold.co/400x300/2980b9/ffffff?text=Competition+Beam'),
            ('Practice Beam Floor Level', 'Floor-level beam for technique training', 149.99, 18, 2, 'https://placehold.co/400x300/3498db/ffffff?text=Practice+Beam'),

            ('Junior Horizontal Bar', 'Adjustable horizontal bar for children, 1m to 1.5m height', 249.99, 12, 3, 'https://placehold.co/400x300/2ecc71/ffffff?text=Junior+Bar'),
            ('Professional Uneven Bars', 'Professional uneven bars with cable tensioners', 2499.00, 3, 3, 'https://placehold.co/400x300/27ae60/ffffff?text=Uneven+Bars'),
            ('Training High Bar', 'Training high bar with adjustable height', 899.99, 8, 3, 'https://placehold.co/400x300/2ecc71/ffffff?text=High+Bar'),
            ('Parallel Bars Pro', 'FIG certified parallel bars, adjustable height', 3499.00, 4, 3, 'https://placehold.co/400x300/27ae60/ffffff?text=Parallel+Bars'),

            ('Mini Fitness Trampoline', '100cm mini trampoline for fitness and warm-up', 79.99, 30, 4, 'https://placehold.co/400x300/9b59b6/ffffff?text=Mini+Trampoline'),
            ('Competition Trampoline', '5m x 3m FIG certified competition trampoline', 4999.00, 2, 4, 'https://placehold.co/400x300/8e44ad/ffffff?text=Competition+Trampoline'),
            ('Double Mini Trampoline', 'Double mini tramp for tumbling training', 1299.99, 6, 4, 'https://placehold.co/400x300/9b59b6/ffffff?text=Double+Mini+Tramp'),

            ('Pro Wood Rings', 'Premium wooden gymnastics rings with adjustable straps, competition grade', 149.99, 20, 5, 'https://cdn.kingsbox.com/assets/media/products/special-offer/used/X-075-1000-R--gymnastic-wood-rings--0.jpg'),
            ('Olympic Competition Rings', 'Official Olympic-style rings for professional training and competition', 4999.00, 15, 5, 'https://img.olympics.com/images/image/private/t_twitter_share_thumb/f_auto/primary/c8odo4mybjbca1q44jcj'),

            ('Competition Pommel Horse', 'FIG certified pommel horse with leather covering', 2299.00, 4, 6, 'https://global-uploads.webflow.com/5d655866b2055c7cbb5d79a1/6402549200a710240ede310c_022023_LarryMathewson031.webp'),
            ('Training Pommel Horse', 'Training pommel horse with synthetic leather', 1199.00, 7, 6, 'https://i.ytimg.com/vi/GEgcDfwD9Kk/maxresdefault.jpg'),
            ('Mushroom Trainer', 'Pommel mushroom for circle training', 399.99, 15, 6, 'https://www.amazon.com/images/I/81PspBEbwzL._AC_SL1500_._FMwebp_.jpg'),

            ('Competition Vault Table', 'FIG certified vaulting table with adjustable height', 2799.00, 3, 7, 'https://icdn.lenta.ru/images/2021/08/06/18/20210806181117116/preview_ee54b814149c97084913d0343e1778ca.jpg'),
            ('Training Vault Table', 'Training vault table for practice', 1499.00, 6, 7, 'https://image.made-in-china.com/2f0j00inkobwNRpBcC/Artistic-Gymnastics-Vault-Table-for-Training.jpg'),
            ('Springboard Competition', 'FIG certified springboard for vault', 599.99, 12, 7, 'https://i.postimg.cc/htmTdWtV/wmremove-transformed.jpg'),

            ('Chalk Powder 500g', 'Pure magnesium carbonate for better grip', 12.99, 100, 8, 'https://placehold.co/400x300/34495e/ffffff?text=Chalk+Powder'),
            ('Leather Grips', 'Genuine leather grips for bars', 34.99, 50, 8, 'https://placehold.co/400x300/2c3e50/ffffff?text=Leather+Grips'),
            ('Gymnova Sports Bag', 'Spacious sports bag with compartments', 49.99, 40, 8, 'https://placehold.co/400x300/34495e/ffffff?text=Sports+Bag'),
            ('Wrist Supports', 'Elastic wrist supports for training', 19.99, 60, 8, 'https://placehold.co/400x300/2c3e50/ffffff?text=Wrist+Supports'),
            ('Training Leotard', 'Professional training leotard', 59.99, 45, 8, 'https://placehold.co/400x300/34495e/ffffff?text=Training+Leotard'),
            ('Competition Leotard', 'Team competition leotard with crystals', 189.99, 20, 8, 'https://placehold.co/400x300/2c3e50/ffffff?text=Competition+Leotard')
        `);
        console.log('✅ Products created (30)');

        console.log('\n🎉 Database setup complete!\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  LOGIN CREDENTIALS:');
        console.log('  📧 Admin: admin@gymnova.com');
        console.log('  🔑 Password: admin123');
        console.log('');
        console.log('  📧 User: user@test.com');
        console.log('  🔑 Password: test123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

setupDatabase();