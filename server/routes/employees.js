const express = require('express');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');

const router = express.Router();

// POST /api/employees
router.post('/', async (req, res) => {
  try {
    const { employee_id, full_name, email, password } = req.body;

    if (!employee_id || !full_name || !email || !password) {
      return res.status(400).json({ error: 'employee_id, full_name, email, password are required.' });
    }

    const exists = await Employee.findOne({ $or: [{ employee_id }, { email }] });
    if (exists) {
      return res.status(409).json({ error: 'Employee ID or email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt);

    const doc = await Employee.create({ employee_id, full_name, email, hashed_password });
    res.status(201).json({
      _id: doc._id,
      employee_id: doc.employee_id,
      full_name: doc.full_name,
      email: doc.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
