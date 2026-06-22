const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../utils/db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware, roleMiddleware(['admin']));

router.get('/', async (req, res) => {
  try {
    const users = await db.get('users');
    const safeUsers = users.map(({ passwordHash, ...user }) => user);
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Имя пользователя и пароль обязательны' });
  }

  try {
    const existing = await db.getUserByUsername(username);
    if (existing) {
      return res.status(400).json({ error: 'Пользователь с таким именем уже существует' });
    }

    const newUser = {
      id: uuidv4(),
      username,
      email: email || '',
      passwordHash: bcrypt.hashSync(password, 10),
      role: role || 'editor',
      createdAt: new Date().toISOString(),
    };

    const result = await db.insert('users', newUser);
    const { passwordHash, ...userResponse } = result;
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const existing = await db.get('users', req.params.id);
    if (!existing) return res.status(404).json({ error: 'Пользователь не найден' });

    const { username, email, role, password } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (role) updateData.role = role;
    if (password) updateData.passwordHash = bcrypt.hashSync(password, 10);

    const result = await db.update('users', req.params.id, updateData);
    const { passwordHash, ...userResponse } = result;
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  if (req.params.id === req.user.userId) {
    return res.status(400).json({ error: 'Нельзя удалить самого себя' });
  }

  try {
    const existing = await db.get('users', req.params.id);
    if (!existing) return res.status(404).json({ error: 'Пользователь не найден' });

    await db.delete('users', req.params.id);
    res.json({ message: 'Пользователь удалён' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
