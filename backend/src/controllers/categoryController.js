const pool = require('../config/database');

// Récupérer toutes les catégories
exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories ORDER BY nom');
    res.json(categories);
  } catch (error) {
    console.error('Erreur récupération catégories:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer une catégorie par ID
exports.getCategoryById = async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    res.json(categories[0]);
  } catch (error) {
    console.error('Erreur récupération catégorie:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer une catégorie (admin)
exports.createCategory = async (req, res) => {
  try {
    const { nom, description, image_url } = req.body;
    const [result] = await pool.query(
      'INSERT INTO categories (nom, description, image_url) VALUES (?, ?, ?)',
      [nom, description, image_url]
    );
    res.status(201).json({ message: 'Catégorie créée', id: result.insertId });
  } catch (error) {
    console.error('Erreur création catégorie:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour une catégorie (admin)
exports.updateCategory = async (req, res) => {
  try {
    const { nom, description, image_url } = req.body;
    await pool.query(
      'UPDATE categories SET nom = ?, description = ?, image_url = ? WHERE id = ?',
      [nom, description, image_url, req.params.id]
    );
    res.json({ message: 'Catégorie mise à jour' });
  } catch (error) {
    console.error('Erreur mise à jour catégorie:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer une catégorie (admin)
exports.deleteCategory = async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Catégorie supprimée' });
  } catch (error) {
    console.error('Erreur suppression catégorie:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};