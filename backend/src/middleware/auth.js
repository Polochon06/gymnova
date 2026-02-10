const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Middleware d'authentification
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await pool.query('SELECT id, email, nom, prenom, role FROM users WHERE id = ?', [decoded.userId]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

// Middleware pour vérifier le rôle admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
  }
  next();
};

module.exports = { auth, isAdmin };