const pool = require('../config/database');

// Récupérer tous les produits
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, sort, limit = 20, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, c.nom as categorie_nom
      FROM products p
      LEFT JOIN categories c ON p.categorie_id = c.id
      WHERE p.actif = 1
    `;
    const params = [];

    if (category) {
      query += ' AND p.categorie_id = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (p.nom LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Tri
    switch (sort) {
      case 'price_asc':
        query += ' ORDER BY p.prix ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY p.prix DESC';
        break;
      case 'name':
        query += ' ORDER BY p.nom ASC';
        break;
      default:
        query += ' ORDER BY p.created_at DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await pool.query(query, params);

    // Compter le total
    let countQuery = 'SELECT COUNT(*) as total FROM products p WHERE p.actif = 1';
    const countParams = [];
    if (category) {
      countQuery += ' AND p.categorie_id = ?';
      countParams.push(category);
    }
    if (search) {
      countQuery += ' AND (p.nom LIKE ? OR p.description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    const [countResult] = await pool.query(countQuery, countParams);

    res.json({
      products,
      total: countResult[0].total,
      page: parseInt(page),
      totalPages: Math.ceil(countResult[0].total / limit)
    });
  } catch (error) {
    console.error('Erreur récupération produits:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer un produit par ID
exports.getProductById = async (req, res) => {
  try {
    const [products] = await pool.query(
      `SELECT p.*, c.nom as categorie_nom
       FROM products p
       LEFT JOIN categories c ON p.categorie_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Récupérer les images supplémentaires
    const [images] = await pool.query(
      'SELECT * FROM product_images WHERE product_id = ?',
      [req.params.id]
    );

    res.json({ ...products[0], images });
  } catch (error) {
    console.error('Erreur récupération produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer un produit (admin)
exports.createProduct = async (req, res) => {
  try {
    const { nom, description, prix, stock, categorie_id, image_url } = req.body;

    const [result] = await pool.query(
      'INSERT INTO products (nom, description, prix, stock, categorie_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [nom, description, prix, stock || 0, categorie_id, image_url]
    );

    res.status(201).json({ message: 'Produit créé', id: result.insertId });
  } catch (error) {
    console.error('Erreur création produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour un produit (admin)
exports.updateProduct = async (req, res) => {
  try {
    const { nom, description, prix, stock, categorie_id, image_url, actif } = req.body;

    await pool.query(
      'UPDATE products SET nom = ?, description = ?, prix = ?, stock = ?, categorie_id = ?, image_url = ?, actif = ? WHERE id = ?',
      [nom, description, prix, stock, categorie_id, image_url, actif, req.params.id]
    );

    res.json({ message: 'Produit mis à jour' });
  } catch (error) {
    console.error('Erreur mise à jour produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un produit (admin)
exports.deleteProduct = async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    console.error('Erreur suppression produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};