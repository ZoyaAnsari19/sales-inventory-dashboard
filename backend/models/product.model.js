// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   productName: String,
//   description: String,
//   category: String,
//   quantityInStock: Number,
//   price: Number,
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Product', productSchema);

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },   // normalized name
  description: { type: String, default: '' },
  category: { type: String, default: '' },
  stock: { type: Number, default: 0 },             // renamed from quantityInStock
  price: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
