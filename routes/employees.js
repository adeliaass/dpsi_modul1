const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { lastName, firstName, birthDate, photo, notes } = req.body;
    const employee = await Employee.create({ lastName, firstName, birthDate, photo, notes });
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const employees = await Employee.findAll();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;
    try {
      const employee = await Employee.findByPk(id);
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
      const { lastName, firstName, birthDate, photo, notes } = req.body;
      await employee.update({ lastName, firstName, birthDate, photo, notes });
      res.json(employee);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;
    try {
      const employee = await Employee.findByPk(id);
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
      await employee.destroy();
      res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
