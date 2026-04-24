const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readDb, writeDb } = require('../utils/db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
const adminRouter = express.Router();

// Public: get published events
router.get('/', (req, res) => {
  const db = readDb();
  const events = db.events.filter(e => e.published);
  res.json(events);
});

router.get('/:id', (req, res) => {
  const db = readDb();
  const event = db.events.find(e => e.id === req.params.id && e.published);
  if (!event) return res.status(404).json({ error: 'Не найдено' });
  res.json(event);
});

// Admin: CRUD
adminRouter.use(authMiddleware, roleMiddleware(['editor', 'admin']));

adminRouter.get('/', (req, res) => {
  const db = readDb();
  res.json(db.events);
});

adminRouter.post('/', (req, res) => {
  const db = readDb();
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
  db.events.push(newEvent);
  writeDb(db);
  res.status(201).json(newEvent);
});

adminRouter.put('/:id', (req, res) => {
  const db = readDb();
  const index = db.events.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Не найдено' });

  db.events[index] = {
    ...db.events[index],
    ...req.body,
    id: db.events[index].id,
    createdAt: db.events[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  writeDb(db);
  res.json(db.events[index]);
});

adminRouter.delete('/:id', (req, res) => {
  const db = readDb();
  const index = db.events.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Не найдено' });

  db.events.splice(index, 1);
  writeDb(db);
  res.json({ message: 'Удалено' });
});

module.exports = { router, adminRouter };
