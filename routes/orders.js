const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { customerID, employeeID, orderDate, shipperID } = req.body;
    const order = await Order.create({ customerID, employeeID, orderDate, shipperID });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const orders = await Order.findAll();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findByPk(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      const { customerID, employeeID, orderDate, shipperID } = req.body;
      await order.update({ customerID, employeeID, orderDate, shipperID });
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findByPk(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      await order.destroy();
      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
