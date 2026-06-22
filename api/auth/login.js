const bcrypt = require('bcryptjs');
const { db } = require('../../lib/db');
const { createToken } = require('../../lib/auth');

module.exports = async (req, res) => {
  try {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Введите имя пользователя и пароль' });
    }

    const user = await db.getUserByUsername(username);

    if (!user) {
      return res.status(401).json({ error: 'Неверные учётные данные' });
    }

    const isValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Неверные учётные данные' });
    }

    const token = createToken({ userId: user.id, role: user.role });

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
