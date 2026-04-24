const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readDb, writeDb } = require('../utils/db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
const adminRouter = express.Router();

// Public routes
router.get('/', (req, res) => {
  const db = readDb();
  res.json({
    councils: db.councils,
    regionalCouncils: db.regionalCouncils
  });
});

// Admin routes
adminRouter.use(authMiddleware, roleMiddleware(['editor', 'admin']));

// Councils CRUD
adminRouter.get('/main', (req, res) => {
  const db = readDb();
  res.json(db.councils);
});

adminRouter.post('/main', (req, res) => {
  const db = readDb();
  const newItem = { id: uuidv4(), ...req.body };
  db.councils.push(newItem);
  writeDb(db);
  res.status(201).json(newItem);
});

adminRouter.put('/main/:id', (req, res) => {
  const db = readDb();
  const index = db.councils.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  db.councils[index] = { ...db.councils[index], ...req.body, id: req.params.id };
  writeDb(db);
  res.json(db.councils[index]);
});

adminRouter.delete('/main/:id', (req, res) => {
  const db = readDb();
  db.councils = db.councils.filter(item => item.id !== req.params.id);
  writeDb(db);
  res.json({ message: 'Deleted' });
});

// Regional Councils CRUD
adminRouter.get('/regional', (req, res) => {
  const db = readDb();
  res.json(db.regionalCouncils);
});

adminRouter.post('/regional', (req, res) => {
  const db = readDb();
  const newItem = { id: uuidv4(), ...req.body };
  db.regionalCouncils.push(newItem);
  writeDb(db);
  res.status(201).json(newItem);
});

adminRouter.put('/regional/:id', (req, res) => {
  const db = readDb();
  const index = db.regionalCouncils.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  db.regionalCouncils[index] = { ...db.regionalCouncils[index], ...req.body, id: req.params.id };
  writeDb(db);
  res.json(db.regionalCouncils[index]);
});

adminRouter.delete('/regional/:id', (req, res) => {
  const db = readDb();
  db.regionalCouncils = db.regionalCouncils.filter(item => item.id !== req.params.id);
  writeDb(db);
  res.json({ message: 'Deleted' });
});

module.exports = { router, adminRouter };
