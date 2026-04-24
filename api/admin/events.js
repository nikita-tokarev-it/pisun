const { readDb, writeDb } = require('../../lib/db');
const { verifyToken, checkRole } = require('../../lib/auth');

module.exports = async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const user = verifyToken(req);
    if (!checkRole(user, ['editor', 'admin'])) {
      return res.status(401).json({ error: 'Не авторизован' });
    }

    const db = readDb();

    if (req.method === 'GET') {
      return res.json(db.events);
    }

    if (req.method === 'POST') {
      const now = new Date().toISOString();
      const newEvent = {
        id: Date.now().toString(),
        type: req.body?.type || 'news',
        title: req.body?.title,
        date: req.body?.date,
        image: req.body?.image || '',
        description: req.body?.description || '',
        fullContent: req.body?.fullContent || '',
        published: req.body?.published !== undefined ? req.body.published : true,
        createdAt: now,
        updatedAt: now,
      };
      db.events.push(newEvent);
      writeDb(db);
      return res.status(201).json(newEvent);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const index = db.events.findIndex(e => e.id === id);
      if (index === -1) return res.status(404).json({ error: 'Не найдено' });

      db.events[index] = {
        ...db.events[index],
        ...req.body,
        id: db.events[index].id,
        createdAt: db.events[index].createdAt,
        updatedAt: new Date().toISOString(),
      };
      writeDb(db);
      return res.json(db.events[index]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      const index = db.events.findIndex(e => e.id === id);
      if (index === -1) return res.status(404).json({ error: 'Не найдено' });

      db.events.splice(index, 1);
      writeDb(db);
      return res.json({ message: 'Удалено' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin Events API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
