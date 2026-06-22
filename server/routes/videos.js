const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../utils/db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
const adminRouter = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await db.get('videos', null, { published: true });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.use(authMiddleware, roleMiddleware(['editor', 'admin']));

adminRouter.get('/', async (req, res) => {
  try {
    const items = await db.get('videos');
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.post('/', async (req, res) => {
  try {
    const now = new Date().toISOString();
    const item = {
      id: uuidv4(),
      title: req.body.title,
      date: req.body.date,
      thumbnail: req.body.thumbnail || '',
      videoUrl: req.body.videoUrl || '',
      published: req.body.published !== undefined ? req.body.published : true,
      createdAt: now,
    };
    const result = await db.insert('videos', item);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.put('/:id', async (req, res) => {
  try {
    const existing = await db.get('videos', req.params.id);
    if (!existing) return res.status(404).json({ error: 'Не найдено' });

    const result = await db.update('videos', req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.delete('/:id', async (req, res) => {
  try {
    const existing = await db.get('videos', req.params.id);
    if (!existing) return res.status(404).json({ error: 'Не найдено' });

    await db.delete('videos', req.params.id);
    res.json({ message: 'Удалено' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, adminRouter };
