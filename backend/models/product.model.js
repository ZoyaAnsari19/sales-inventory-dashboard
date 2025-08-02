const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: String,
  description: String,
  category: String,
  quantityInStock: Number,
  price: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
