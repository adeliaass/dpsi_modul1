const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { customerName, contactName, address, city, postalCode, country } = req.body;
    const customer = await Customer.create({ customerName, contactName, address, city, postalCode, country });
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const customers = await Customer.findAll();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;
    try {
      const customer = await Customer.findByPk(id);
      if (!customer) return res.status(404).json({ message: 'Customer not found' });
      const { customerName, contactName, address, city, postalCode, country } = req.body;
      await customer.update({ customerName, contactName, address, city, postalCode, country });
      res.json(customer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;
    try {
      const customer = await Customer.findByPk(id);
      if (!customer) return res.status(404).json({ message: 'Customer not found' });
      await customer.destroy();
      res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

module.exports = router;
