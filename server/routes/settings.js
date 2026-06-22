const express = require('express');
const { db } = require('../utils/db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
const adminRouter = express.Router();

// Public: get settings
router.get('/', async (req, res) => {
  try {
    const settings = await db.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: update settings
adminRouter.use(authMiddleware, roleMiddleware(['editor', 'admin']));

adminRouter.get('/', async (req, res) => {
  try {
    const settings = await db.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.put('/', async (req, res) => {
  try {
    const currentSettings = await db.getSettings();
    const newSettings = {
      ...currentSettings,
      ...req.body
    };
    const result = await db.updateSettings(newSettings);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, adminRouter };
