const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../utils/db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
const adminRouter = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await db.get('documents', null, { published: true });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.use(authMiddleware, roleMiddleware(['editor', 'admin']));

adminRouter.get('/', async (req, res) => {
  try {
    const items = await db.get('documents');
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
      category: req.body.category,
      title: req.body.title,
      file: req.body.file || '',
      date: req.body.date,
      published: req.body.published !== undefined ? req.body.published : true,
      createdAt: now,
      updatedAt: now,
    };
    const result = await db.insert('documents', item);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.put('/:id', async (req, res) => {
  try {
    const existing = await db.get('documents', req.params.id);
    if (!existing) return res.status(404).json({ error: 'Не найдено' });

    const updatedItem = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    const result = await db.update('documents', req.params.id, updatedItem);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.delete('/:id', async (req, res) => {
  try {
    const existing = await db.get('documents', req.params.id);
    if (!existing) return res.status(404).json({ error: 'Не найдено' });

    await db.delete('documents', req.params.id);
    res.json({ message: 'Удалено' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, adminRouter };
