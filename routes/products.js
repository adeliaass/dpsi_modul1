const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize(['admin']), async (req, res, next) => {
  try {
    const { productName, supplierID, categoryID, unit, price } = req.body;
    const newProduct = await Product.create({ productName, supplierID, categoryID, unit, price });
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

router.get('/', authenticate, async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticate, authorize(['admin']), async (req, res, next) => {
  try {
    const { productName, supplierID, categoryID, unit, price } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (product) {
      product.productName = productName;
      product.supplierID = supplierID;
      product.categoryID = categoryID;
      product.unit = unit;
      product.price = price;
      await product.save();
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, authorize(['admin']), async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
