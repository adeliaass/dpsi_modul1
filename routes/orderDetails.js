// routes/orderDetails.js

const express = require('express');
const router = express.Router();
const OrderDetail = require('../models/orderDetail');
const { authenticate, authorize } = require('../middleware/auth');

// Create a new order detail
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { orderID, productID, quantity } = req.body;
    const orderDetail = await OrderDetail.create({ orderID, productID, quantity });
    res.status(201).json(orderDetail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all order details
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const orderDetails = await OrderDetail.findAll();
      res.json(orderDetails);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update an order detail
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;
    try {
      const orderDetail = await OrderDetail.findByPk(id);
      if (!orderDetail) return res.status(404).json({ message: 'Order detail not found' });
      const { orderID, productID, quantity } = req.body;
      await orderDetail.update({ orderID, productID, quantity });
      res.json(orderDetail);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;
    try {
      const orderDetail = await OrderDetail.findByPk(id);
      if (!orderDetail) return res.status(404).json({ message: 'Order detail not found' });
      await orderDetail.destroy();
      res.json({ message: 'Order detail deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

module.exports = router;
