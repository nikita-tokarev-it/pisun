const bcrypt = require('bcryptjs');
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
    if (!checkRole(user, ['admin'])) {
      return res.status(401).json({ error: 'Недостаточно прав' });
    }

    const db = readDb();

    if (req.method === 'GET') {
      const users = db.users.map(({ passwordHash, ...u }) => u);
      return res.json(users);
    }

    if (req.method === 'POST') {
      const { username, email, password, role } = req.body || {};

      if (!username || !password) {
        return res.status(400).json({ error: 'Имя пользователя и пароль обязательны' });
      }

      if (db.users.find(u => u.username === username)) {
        return res.status(400).json({ error: 'Пользователь с таким именем уже существует' });
      }

      const newUser = {
        id: Date.now().toString(),
        username,
        email: email || '',
        passwordHash: bcrypt.hashSync(password, 10),
        role: role || 'editor',
        createdAt: new Date().toISOString(),
      };

      db.users.push(newUser);
      writeDb(db);

      const { passwordHash, ...userResponse } = newUser;
      return res.status(201).json(userResponse);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const index = db.users.findIndex(u => u.id === id);
      if (index === -1) return res.status(404).json({ error: 'Пользователь не найден' });

      const { username, email, role, password } = req.body || {};

      if (username) db.users[index].username = username;
      if (email !== undefined) db.users[index].email = email;
      if (role) db.users[index].role = role;
      if (password) db.users[index].passwordHash = bcrypt.hashSync(password, 10);

      writeDb(db);

      const { passwordHash, ...userResponse } = db.users[index];
      return res.json(userResponse);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (id === user.userId) {
        return res.status(400).json({ error: 'Нельзя удалить самого себя' });
      }

      const index = db.users.findIndex(u => u.id === id);
      if (index === -1) return res.status(404).json({ error: 'Пользователь не найден' });

      db.users.splice(index, 1);
      writeDb(db);
      return res.json({ message: 'Пользователь удалён' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin Users API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
