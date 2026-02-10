const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, isAdmin } = require('../middleware/auth');

// Routes utilisateur (authentifié)
router.post('/', auth, orderController.createOrder);
router.get('/', auth, orderController.getUserOrders);
router.get('/:id', auth, orderController.getOrderById);
router.post('/payment-intent', auth, orderController.createPaymentIntent);
router.post('/confirm-payment', auth, orderController.confirmPayment);

// Routes admin
router.get('/admin/all', auth, isAdmin, orderController.getAllOrders);
router.put('/admin/:id/status', auth, isAdmin, orderController.updateOrderStatus);

module.exports = router;