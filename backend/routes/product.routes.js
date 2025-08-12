// const express = require('express');
// const router = express.Router();
// const Product = require('../models/product.model');
// const {
//   createProduct,
//   getAllProducts
// } = require('../controllers/product.controller');


// // Get all products
// router.get('/', async (req, res) => {
//   const products = await Product.find();
//   res.json(products);
// });


// // Routes
// router.post('/', createProduct);
// router.get('/', getAllProducts);


// // Add new product
// router.post('/', async (req, res) => {
//   const product = new Product(req.body);
//   await product.save();
//   res.status(201).json(product);
// });

// // Update product
// router.put('/:id', async (req, res) => {
//   const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   res.json(updated);
// });

// // Delete product
// router.delete('/:id', async (req, res) => {
//   await Product.findByIdAndDelete(req.params.id);
//   res.json({ message: 'Deleted' });
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');

// GET all
router.get('/', getAllProducts);

// GET by id
router.get('/:id', getProductById);

// POST create
router.post('/', createProduct);

// PUT update
router.put('/:id', updateProduct);

// DELETE
router.delete('/:id', deleteProduct);

module.exports = router;
