// server/index.js
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5001;  // so lab 1 can go 5000, caused alot of errors
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

// MIDDLEWATE
app.use(cors());
app.use(express.json());

// ROUTES
const employeeRoutes = require('./routes/employees');
const projectRoutes = require('./routes/projects');
const assignmentRoutes = require('./routes/assignments');


app.use('/api/employees', employeeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project_assignments', assignmentRoutes);

// Health check 
app.get('/health', (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});


// 404 + Error handlers
app.use((req, res, _next) => {
  res.status(404).json({ error: 'Not found' });
});
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

// DB connect then start 
async function start() {
  try {
    if (!MONGO_URI) {
      throw new Error('Missing MONGO_URI / MONGODB_URI in server/.env');
    }

    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URI, { dbName: 'lab2' });

    console.log('Connected to MongoDB');
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}
start();

module.exports = app; 

// be inside cd server
// node index.js
