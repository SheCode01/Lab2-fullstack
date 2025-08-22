const express = require('express');
const Project = require('../models/Project');

const router = express.Router();

// POST /api/projects
router.post('/', async (req, res) => {
  try {
    const { project_code, project_name, project_description } = req.body;

    if (!project_code || !project_name) {
      return res.status(400).json({ error: 'project_code and project_name are required.' });
    }

    const exists = await Project.findOne({ project_code });
    if (exists) {
      return res.status(409).json({ error: 'Project code already exists.' });
    }

    const doc = await Project.create({
      project_code,
      project_name,
      project_description: project_description || ''
    });

    res.status(201).json({
      _id: doc._id,
      project_code: doc.project_code,
      project_name: doc.project_name,
      project_description: doc.project_description || ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
