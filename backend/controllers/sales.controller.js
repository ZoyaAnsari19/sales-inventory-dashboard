const Sale = require('../models/sale.model');
const Product = require('../models/product.model');

// ✅ GET all sales with product details
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('productId');
    const formattedSales = sales.map(sale => ({
      _id: sale._id,
      productId: sale.productId?._id || null,
      productName: sale.productId?.productName || 'Unknown',
      quantity: sale.quantity || 0,
      unitPrice: sale.unitPrice,
      totalAmount: sale.totalAmount,
      saleDate: sale.saleDate
    }));
    res.json(formattedSales);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sales', error });
  }
};

// ✅ POST create new sale
exports.createSale = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const unitPrice = product.price;
    const totalAmount = unitPrice * quantity;

    const sale = new Sale({
      productId,
      quantity,
      unitPrice,
      totalAmount,
      saleDate: new Date()
    });

    await sale.save();
    await Product.updateOne(
      { _id: productId },
      {
        $inc: { 
          salesCount: quantity,    // sales count increase
          stock: -quantity         // stock decrease
        },
        $set: { updatedAt: new Date() }
      }
    );

    res.status(201).json({ message: 'Sale created & product updated', sale });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create sale', error });
  }
};

// ✅ GET sales by date range
exports.getSalesByDateRange = async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ message: 'Start and end dates are required' });
  }

  try {
    const sales = await Sale.find({
      saleDate: {
        $gte: new Date(start),
        $lt: new Date(end)
      }
    }).populate('productId');

    const formatted = sales.map(sale => ({
      _id: sale._id,
      productId: sale.productId?._id || null,
      productName: sale.productId?.productName || 'Unknown',
      quantity: sale.quantity || 0,
      unitPrice: sale.unitPrice,
      totalAmount: sale.totalAmount,
      saleDate: sale.saleDate
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sales by date range', error });
  }
};

// ✅ GET top-selling products
exports.getTopSellingProducts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;

  try {
    const topProducts = await Sale.aggregate([
      {
        $group: {
          _id: '$productId',
          totalSold: { $sum: '$quantity' }
        }
      },
      {
        $sort: { totalSold: -1 }
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          productName: '$product.productName',
          totalSold: 1
        }
      }
    ]);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch top-selling products', error });
  }
};

// ✅ GET today's sales
exports.getTodaySales = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of day

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // next day

    const sales = await Sale.find({
      saleDate: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('productId');

    const formattedSales = sales.map(sale => ({
      _id: sale._id,
      productId: sale.productId?._id || null,
      productName: sale.productId?.productName || 'Unknown',
      quantity: sale.quantity || 0,
      unitPrice: sale.unitPrice,
      totalAmount: sale.totalAmount,
      saleDate: sale.saleDate
    }));

    res.json(formattedSales);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch today\'s sales', error });
  }
};
