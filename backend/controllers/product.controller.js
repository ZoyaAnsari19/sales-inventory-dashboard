// const Product = require('../models/product.model');

// // Create a new product
// exports.createProduct = async (req, res) => {
//   try {
//     const product = new Product(req.body);
//     await product.save();
//     res.status(201).json(product);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating product', error });
//   }
// };

// // Get all products
// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching products', error });
//   }
// };


const Product = require('../models/product.model');

// Helper to normalize request body (handle legacy typos)
function normalizeBody(body) {
  if (body.prouctName && !body.productName) {
    body.productName = body.prouctName;
    delete body.prouctName;
  }
  if (body.quantityInStock !== undefined && body.stock === undefined) {
    body.stock = body.quantityInStock;
    delete body.quantityInStock;
  }
  return body;
}

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const safeBody = normalizeBody({ ...req.body });
    
    // Validate required fields
    if (!safeBody.productName || safeBody.productName.trim() === '') {
      return res.status(400).json({ 
        message: 'Product name is required',
        error: 'productName is required'
      });
    }

    const product = new Product({
      productName: safeBody.productName.trim(),
      description: safeBody.description || '',
      category: safeBody.category || '',
      stock: safeBody.stock || 0,
      price: safeBody.price || 0
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    // Return plain objects with consistent field names
    const fixed = products.map(p => {
      const doc = p._doc ?? p;
      return {
        _id: doc._id,
        productName: doc.productName ?? doc.prouctName ?? '',
        description: doc.description ?? '',
        category: doc.category ?? '',
        stock: doc.stock ?? doc.quantityInStock ?? 0,
        price: doc.price ?? 0,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      };
    });
    res.status(200).json(fixed);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get product by id
exports.getProductById = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    const doc = p._doc ?? p;
    res.json({
      _id: doc._id,
      productName: doc.productName ?? doc.prouctName ?? '',
      description: doc.description ?? '',
      category: doc.category ?? '',
      stock: doc.stock ?? doc.quantityInStock ?? 0,
      price: doc.price ?? 0,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const safeBody = normalizeBody({ ...req.body });
    safeBody.updatedAt = new Date();
    const updated = await Product.findByIdAndUpdate(req.params.id, safeBody, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    const doc = updated._doc ?? updated;
    res.json({
      _id: doc._id,
      productName: doc.productName ?? doc.prouctName ?? '',
      description: doc.description ?? '',
      category: doc.category ?? '',
      stock: doc.stock ?? doc.quantityInStock ?? 0,
      price: doc.price ?? 0,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Error updating product', error });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
