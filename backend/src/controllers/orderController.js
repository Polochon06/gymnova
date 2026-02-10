const pool = require('../config/database');

// Initialize Stripe only if key is configured
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey && stripeKey !== 'sk_test_votre_cle_stripe'
  ? require('stripe')(stripeKey)
  : null;

// Créer une commande
exports.createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { adresse_livraison } = req.body;

    // Récupérer le panier
    const [cartItems] = await connection.query(
      `SELECT c.*, p.nom, p.prix, p.stock
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Panier vide' });
    }

    // Vérifier le stock et calculer le total
    let total = 0;
    for (const item of cartItems) {
      if (item.stock < item.quantite) {
        await connection.rollback();
        return res.status(400).json({ message: `Stock insuffisant pour ${item.nom}` });
      }
      total += item.prix * item.quantite;
    }

    // Créer la commande
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total, adresse_livraison, statut) VALUES (?, ?, ?, ?)',
      [req.user.id, total, adresse_livraison, 'en_attente']
    );

    const orderId = orderResult.insertId;

    // Ajouter les items de la commande et mettre à jour le stock
    for (const item of cartItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantite, item.prix]
      );

      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantite, item.product_id]
      );
    }

    // Vider le panier
    await connection.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    await connection.commit();

    res.status(201).json({
      message: 'Commande créée',
      orderId,
      total
    });
  } catch (error) {
    await connection.rollback();
    console.error('Erreur création commande:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  } finally {
    connection.release();
  }
};

// Récupérer les commandes de l'utilisateur
exports.getUserOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    // Récupérer les items pour chaque commande
    for (const order of orders) {
      const [items] = await pool.query(
        `SELECT oi.*, p.nom, p.image_url
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer une commande par ID
exports.getOrderById = async (req, res) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    const [items] = await pool.query(
      `SELECT oi.*, p.nom, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({ ...orders[0], items });
  } catch (error) {
    console.error('Erreur récupération commande:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer une intention de paiement Stripe (ou mode démo)
exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [orderId, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    const order = orders[0];

    // Mode démo si Stripe n'est pas configuré
    if (!stripe) {
      const demoPaymentId = 'demo_' + Date.now();
      await pool.query(
        'UPDATE orders SET stripe_payment_id = ? WHERE id = ?',
        [demoPaymentId, orderId]
      );
      return res.json({ clientSecret: 'demo_secret', demoMode: true });
    }

    // Mode production avec Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100),
      currency: 'eur',
      metadata: { orderId: order.id.toString() }
    });

    await pool.query(
      'UPDATE orders SET stripe_payment_id = ? WHERE id = ?',
      [paymentIntent.id, orderId]
    );

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Erreur création paiement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Confirmer le paiement
exports.confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    await pool.query(
      "UPDATE orders SET statut = 'payee', payment_status = 'completed' WHERE id = ? AND user_id = ?",
      [orderId, req.user.id]
    );

    res.json({ message: 'Paiement confirmé' });
  } catch (error) {
    console.error('Erreur confirmation paiement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Admin: Récupérer toutes les commandes
exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, u.email, u.nom, u.prenom
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );
    res.json(orders);
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Admin: Mettre à jour le statut
exports.updateOrderStatus = async (req, res) => {
  try {
    const { statut } = req.body;
    await pool.query('UPDATE orders SET statut = ? WHERE id = ?', [statut, req.params.id]);
    res.json({ message: 'Statut mis à jour' });
  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};