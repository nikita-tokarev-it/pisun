const express = require('express');
const { readDb, writeDb } = require('../utils/db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
const adminRouter = express.Router();

// Public: get map data
router.get('/', (req, res) => {
  const db = readDb();
  res.json(db.mapData || []);
});

// Admin: update map data
adminRouter.use(authMiddleware, roleMiddleware(['editor', 'admin']));

adminRouter.get('/', (req, res) => {
  const db = readDb();
  res.json(db.mapData || []);
});

adminRouter.put('/:id', (req, res) => {
  const db = readDb();
  const index = db.mapData.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  
  db.mapData[index] = { ...db.mapData[index], ...req.body, id: req.params.id };
  writeDb(db);
  res.json(db.mapData[index]);
});

module.exports = { router, adminRouter };
