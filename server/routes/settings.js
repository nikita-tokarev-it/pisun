const express = require('express');
const { readDb, writeDb } = require('../utils/db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
const adminRouter = express.Router();

// Public: get settings
router.get('/', (req, res) => {
  const db = readDb();
  res.json(db.settings);
});

// Admin: update settings
adminRouter.use(authMiddleware, roleMiddleware(['editor', 'admin']));

adminRouter.get('/', (req, res) => {
  const db = readDb();
  res.json(db.settings);
});

adminRouter.put('/', (req, res) => {
  const db = readDb();
  db.settings = {
    ...db.settings,
    ...req.body
  };
  writeDb(db);
  res.json(db.settings);
});

module.exports = { router, adminRouter };
