const { db } = require('../lib/db');
const { verifyToken, checkRole } = require('../lib/auth');

module.exports = async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const user = verifyToken(req);
    const { collection, id, type } = req.query;
    
    // Users management requires 'admin' role, others require 'editor' or 'admin'
    const requiredRoles = collection === 'users' ? ['admin'] : ['editor', 'admin'];

    if (!checkRole(user, requiredRoles)) {
      return res.status(401).json({ error: 'Недостаточно прав' });
    }

    // Mapping for special collections or table name normalization
    let tableName = collection;
    if (collection === 'councils' && type === 'regional') {
      tableName = 'regional_councils';
    } else if (collection === 'pressReleases') {
      tableName = 'press_releases';
    } else if (collection === 'mapData') {
      tableName = 'map_data';
    }

    // Special handling for settings (single row in DB)
    if (tableName === 'settings') {
      if (req.method === 'GET') {
        const settings = await db.getSettings();
        return res.json(settings);
      }
      if (req.method === 'PUT') {
        const updated = await db.updateSettings(req.body);
        return res.json(updated.value);
      }
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // CRUD operations
    if (req.method === 'GET') {
      const data = await db.get(tableName, id);
      if (tableName === 'users') {
        if (Array.isArray(data)) {
          return res.json(data.map(({ passwordHash, ...u }) => u));
        } else if (data) {
          const { passwordHash, ...u } = data;
          return res.json(u);
        }
      }
      return res.json(data);
    }

    if (req.method === 'POST') {
      let item = { ...req.body };
      
      if (tableName === 'users') {
        const bcrypt = require('bcryptjs');
        if (!item.username || !item.password) {
          return res.status(400).json({ error: 'Имя пользователя и пароль обязательны' });
        }
        const existing = await db.getUserByUsername(item.username);
        if (existing) {
          return res.status(400).json({ error: 'Пользователь с таким именем уже существует' });
        }
        item.passwordHash = bcrypt.hashSync(item.password, 10);
        delete item.password;
        item.createdAt = new Date().toISOString();
      }

      if (['events', 'press_releases', 'announcements', 'documents'].includes(tableName)) {
        item.createdAt = item.createdAt || new Date().toISOString();
        item.updatedAt = new Date().toISOString();
      }

      const result = await db.insert(tableName, item);
      
      if (tableName === 'users') {
        const { passwordHash, ...u } = result;
        return res.status(201).json(u);
      }
      return res.status(201).json(result);
    }

    if (req.method === 'PUT') {
      if (!id) return res.status(400).json({ error: 'ID required' });
      
      let updateData = { ...req.body };
      
      if (tableName === 'users' && updateData.password) {
        const bcrypt = require('bcryptjs');
        updateData.passwordHash = bcrypt.hashSync(updateData.password, 10);
        delete updateData.password;
      }

      if (['events', 'press_releases', 'announcements', 'documents'].includes(tableName)) {
        updateData.updatedAt = new Date().toISOString();
      }

      const result = await db.update(tableName, id, updateData);
      
      if (tableName === 'users') {
        const { passwordHash, ...u } = result;
        return res.json(u);
      }
      return res.json(result);
    }

    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'ID required' });

      if (tableName === 'users' && id === user.userId) {
        return res.status(400).json({ error: 'Нельзя удалить самого себя' });
      }

      await db.delete(tableName, id);
      return res.json({ message: 'Удалено' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(`Admin API Handler Error (${req.query.collection}):`, error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
