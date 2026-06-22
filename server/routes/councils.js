const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../utils/db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
const adminRouter = express.Router();

// Public routes
router.get('/', async (req, res) => {
  try {
    const [councils, regionalCouncils] = await Promise.all([
      db.get('councils'),
      db.get('regional_councils')
    ]);
    res.json({ councils, regionalCouncils });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin routes
adminRouter.use(authMiddleware, roleMiddleware(['editor', 'admin']));

// Councils CRUD
adminRouter.get('/main', async (req, res) => {
  try {
    const councils = await db.get('councils');
    res.json(councils);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.post('/main', async (req, res) => {
  try {
    const newItem = { id: uuidv4(), ...req.body };
    const result = await db.insert('councils', newItem);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.put('/main/:id', async (req, res) => {
  try {
    const existing = await db.get('councils', req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const result = await db.update('councils', req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.delete('/main/:id', async (req, res) => {
  try {
    const existing = await db.get('councils', req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    await db.delete('councils', req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Regional Councils CRUD
adminRouter.get('/regional', async (req, res) => {
  try {
    const regionalCouncils = await db.get('regional_councils');
    res.json(regionalCouncils);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.post('/regional', async (req, res) => {
  try {
    const newItem = { id: uuidv4(), ...req.body };
    const result = await db.insert('regional_councils', newItem);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.put('/regional/:id', async (req, res) => {
  try {
    const existing = await db.get('regional_councils', req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const result = await db.update('regional_councils', req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.delete('/regional/:id', async (req, res) => {
  try {
    const existing = await db.get('regional_councils', req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    await db.delete('regional_councils', req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, adminRouter };
