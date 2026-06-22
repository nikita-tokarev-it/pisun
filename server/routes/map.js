const express = require('express');
const { db } = require('../utils/db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
const adminRouter = express.Router();

// Public: get map data
router.get('/', async (req, res) => {
  try {
    const mapData = await db.get('map_data');
    res.json(mapData || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: update map data
adminRouter.use(authMiddleware, roleMiddleware(['editor', 'admin']));

adminRouter.get('/', async (req, res) => {
  try {
    const mapData = await db.get('map_data');
    res.json(mapData || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.put('/:id', async (req, res) => {
  try {
    const existing = await db.get('map_data', req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found' });
    
    const result = await db.update('map_data', req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, adminRouter };
