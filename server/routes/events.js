const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../utils/db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
const adminRouter = express.Router();

// Public: get published events
router.get('/', async (req, res) => {
  try {
    const events = await db.get('events', null, { published: true });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await db.get('events', req.params.id);
    if (!event || !event.published) return res.status(404).json({ error: 'Не найдено' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: CRUD
adminRouter.use(authMiddleware, roleMiddleware(['editor', 'admin']));

adminRouter.get('/', async (req, res) => {
  try {
    const events = await db.get('events');
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.post('/', async (req, res) => {
  try {
    const now = new Date().toISOString();
    const newEvent = {
      id: uuidv4(),
      type: req.body.type || 'news',
      title: req.body.title,
      date: req.body.date,
      image: req.body.image || '',
      description: req.body.description || '',
      fullContent: req.body.fullContent || '',
      published: req.body.published !== undefined ? req.body.published : true,
      createdAt: now,
      updatedAt: now,
    };
    const result = await db.insert('events', newEvent);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.put('/:id', async (req, res) => {
  try {
    const existing = await db.get('events', req.params.id);
    if (!existing) return res.status(404).json({ error: 'Не найдено' });

    const updatedEvent = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    
    const result = await db.update('events', req.params.id, updatedEvent);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.delete('/:id', async (req, res) => {
  try {
    const existing = await db.get('events', req.params.id);
    if (!existing) return res.status(404).json({ error: 'Не найдено' });

    await db.delete('events', req.params.id);
    res.json({ message: 'Удалено' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, adminRouter };
