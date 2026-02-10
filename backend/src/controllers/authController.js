const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Inscription
exports.register = async (req, res) => {
  try {
    const { email, password, nom, prenom, telephone } = req.body;

    // Vérifier si l'email existe déjà
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const [result] = await pool.query(
      'INSERT INTO users (email, password, nom, prenom, telephone) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, nom, prenom, telephone || null]
    );

    // Générer le token
    const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: { id: result.insertId, email, nom, prenom, role: 'client' }
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Chercher l'utilisateur
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const user = users[0];

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer le token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Connexion réussie',
      token,
      user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, role: user.role }
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Profil utilisateur
exports.getProfile = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, email, nom, prenom, telephone, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json(users[0]);
  } catch (error) {
    console.error('Erreur profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour le profil
exports.updateProfile = async (req, res) => {
  try {
    const { nom, prenom, telephone } = req.body;
    await pool.query(
      'UPDATE users SET nom = ?, prenom = ?, telephone = ? WHERE id = ?',
      [nom, prenom, telephone, req.user.id]
    );
    res.json({ message: 'Profil mis à jour' });
  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};