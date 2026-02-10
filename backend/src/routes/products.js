const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, isAdmin } = require('../middleware/auth');

// Routes publiques
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Routes admin
router.post('/', auth, isAdmin, productController.createProduct);
router.put('/:id', auth, isAdmin, productController.updateProduct);
router.delete('/:id', auth, isAdmin, productController.deleteProduct);

module.exports = router;