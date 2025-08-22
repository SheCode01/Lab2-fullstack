// server/routes/assignments.js
const express = require('express');
const router = express.Router();
const ProjectAssignment = require('../models/ProjectAssignment');
const Employee = require('../models/Employee');
const Project = require('../models/Project');

// POST /api/project_assignments
// Create an assignment (employee -> project) with a start_date
router.post('/', async (req, res) => {
  try {
    const { employee_id, project_code, start_date } = req.body;

    // Basic validation
    if (!employee_id || !project_code || !start_date) {
      return res.status(400).json({ error: 'employee_id, project_code, and start_date are required.' });
    }

    const employee = await Employee.findOne({ employee_id });
    const project = await Project.findOne({ project_code });

    if (!employee || !project) {
      return res.status(404).json({ error: 'Employee or Project not found.' });
    }

    // Parse start_date
    const parsed = new Date(start_date);
    if (Number.isNaN(parsed.getTime())) {
      return res.status(400).json({ error: 'Invalid start_date. Use an ISO date like 2025-08-21.' });
    }

    const newAssignment = new ProjectAssignment({
      employee_id: employee._id,
      project_code: project._id,
      start_date: parsed
    });

    const saved = await newAssignment.save();

    // Return the populated doc
    const populated = await saved
      .populate({ path: 'employee_id', select: 'employee_id full_name' })
      .populate({ path: 'project_code', select: 'project_code project_name' });

    return res.status(201).json({
      _id: populated._id,
      employee_id: populated.employee_id.employee_id,
      employee_name: populated.employee_id.full_name,
      project_code: populated.project_code.project_code,
      project_name: populated.project_code.project_name,
      start_date: populated.start_date
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/project_assignments?limit=5
// List assignments (newest first), populated, optionally limited
router.get('/', async (req, res) => {
  try {
    const limit = Math.max(0, parseInt(req.query.limit || '0', 10)) || undefined;

    const rows = await ProjectAssignment.find({})
      .sort({ start_date: -1 })
      .limit(limit)
      .populate({ path: 'employee_id', select: 'employee_id full_name' })
      .populate({ path: 'project_code', select: 'project_code project_name' })
      .lean();

    const result = rows.map(r => ({
      _id: r._id,
      employee_id: r.employee_id?.employee_id,
      employee_name: r.employee_id?.full_name,
      project_code: r.project_code?.project_code,
      project_name: r.project_code?.project_name,
      start_date: r.start_date
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
