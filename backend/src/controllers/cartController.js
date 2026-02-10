const pool = require('../config/database');

// Récupérer le panier
exports.getCart = async (req, res) => {
  try {
    const [items] = await pool.query(
      `SELECT c.*, p.nom, p.prix, p.image_url, p.stock
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );

    const total = items.reduce((sum, item) => sum + (item.prix * item.quantite), 0);

    res.json({ items, total });
  } catch (error) {
    console.error('Erreur récupération panier:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Ajouter au panier
exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantite = 1 } = req.body;

    // Vérifier si le produit existe et a du stock
    const [products] = await pool.query('SELECT * FROM products WHERE id = ? AND actif = 1', [product_id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    if (products[0].stock < quantite) {
      return res.status(400).json({ message: 'Stock insuffisant' });
    }

    // Vérifier si le produit est déjà dans le panier
    const [existing] = await pool.query(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );

    if (existing.length > 0) {
      // Mettre à jour la quantité
      const newQuantite = existing[0].quantite + quantite;
      if (newQuantite > products[0].stock) {
        return res.status(400).json({ message: 'Stock insuffisant' });
      }
      await pool.query(
        'UPDATE cart SET quantite = ? WHERE user_id = ? AND product_id = ?',
        [newQuantite, req.user.id, product_id]
      );
    } else {
      // Ajouter au panier
      await pool.query(
        'INSERT INTO cart (user_id, product_id, quantite) VALUES (?, ?, ?)',
        [req.user.id, product_id, quantite]
      );
    }

    res.json({ message: 'Produit ajouté au panier' });
  } catch (error) {
    console.error('Erreur ajout panier:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour la quantité
exports.updateCartItem = async (req, res) => {
  try {
    const { quantite } = req.body;
    const { productId } = req.params;

    if (quantite <= 0) {
      await pool.query(
        'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
        [req.user.id, productId]
      );
      return res.json({ message: 'Produit retiré du panier' });
    }

    // Vérifier le stock
    const [products] = await pool.query('SELECT stock FROM products WHERE id = ?', [productId]);
    if (products.length === 0 || products[0].stock < quantite) {
      return res.status(400).json({ message: 'Stock insuffisant' });
    }

    await pool.query(
      'UPDATE cart SET quantite = ? WHERE user_id = ? AND product_id = ?',
      [quantite, req.user.id, productId]
    );

    res.json({ message: 'Quantité mise à jour' });
  } catch (error) {
    console.error('Erreur mise à jour panier:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer du panier
exports.removeFromCart = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
      [req.user.id, req.params.productId]
    );
    res.json({ message: 'Produit retiré du panier' });
  } catch (error) {
    console.error('Erreur suppression panier:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Vider le panier
exports.clearCart = async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Panier vidé' });
  } catch (error) {
    console.error('Erreur vidage panier:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};