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
      return res.json(db.videos);
    }

    if (req.method === 'POST') {
      const now = new Date().toISOString();
      const item = {
        id: Date.now().toString(),
        title: req.body?.title,
        date: req.body?.date,
        thumbnail: req.body?.thumbnail || '',
        videoUrl: req.body?.videoUrl || '',
        published: req.body?.published !== undefined ? req.body.published : true,
        createdAt: now,
      };
      db.videos.push(item);
      writeDb(db);
      return res.status(201).json(item);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const index = db.videos.findIndex(i => i.id === id);
      if (index === -1) return res.status(404).json({ error: 'Не найдено' });

      db.videos[index] = {
        ...db.videos[index],
        ...req.body,
        id: db.videos[index].id,
        createdAt: db.videos[index].createdAt,
      };
      writeDb(db);
      return res.json(db.videos[index]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      const index = db.videos.findIndex(i => i.id === id);
      if (index === -1) return res.status(404).json({ error: 'Не найдено' });

      db.videos.splice(index, 1);
      writeDb(db);
      return res.json({ message: 'Удалено' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin Videos API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
