// routes/sale.routes.js
const express = require('express');
const router = express.Router();
const saleController = require('../controllers/sales.controller');
router.get('/top-selling', saleController.getTopSellingProducts);

router.get('/', saleController.getAllSales);
router.post('/', saleController.createSale);
router.get('/range', saleController.getSalesByDateRange);
router.get('/top-selling', saleController.getTopSellingProducts);
router.get('/today', saleController.getTodaySales);

module.exports = router;
