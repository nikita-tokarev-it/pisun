const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readDb, writeDb } = require('../utils/db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
const adminRouter = express.Router();

router.get('/', (req, res) => {
  const db = readDb();
  res.json(db.announcements.filter(i => i.published));
});

router.get('/:id', (req, res) => {
  const db = readDb();
  const item = db.announcements.find(i => i.id === req.params.id && i.published);
  if (!item) return res.status(404).json({ error: 'Не найдено' });
  res.json(item);
});

adminRouter.use(authMiddleware, roleMiddleware(['editor', 'admin']));

adminRouter.get('/', (req, res) => {
  const db = readDb();
  res.json(db.announcements);
});

adminRouter.post('/', (req, res) => {
  const db = readDb();
  const now = new Date().toISOString();
  const item = {
    id: uuidv4(),
    title: req.body.title,
    date: req.body.date,
    description: req.body.description || '',
    fullContent: req.body.fullContent || '',
    published: req.body.published !== undefined ? req.body.published : true,
    createdAt: now,
    updatedAt: now,
  };
  db.announcements.push(item);
  writeDb(db);
  res.status(201).json(item);
});

adminRouter.put('/:id', (req, res) => {
  const db = readDb();
  const index = db.announcements.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Не найдено' });
  db.announcements[index] = {
    ...db.announcements[index],
    ...req.body,
    id: db.announcements[index].id,
    createdAt: db.announcements[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  writeDb(db);
  res.json(db.announcements[index]);
});

adminRouter.delete('/:id', (req, res) => {
  const db = readDb();
  const index = db.announcements.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Не найдено' });
  db.announcements.splice(index, 1);
  writeDb(db);
  res.json({ message: 'Удалено' });
});

module.exports = { router, adminRouter };
