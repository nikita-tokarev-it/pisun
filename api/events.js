const { readDb } = require('../lib/db');

module.exports = async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const db = readDb();
    const { id } = req.query;

    if (id) {
      const event = db.events.find(e => e.id === id && e.published);
      if (!event) return res.status(404).json({ error: 'Event not found' });
      return res.json(event);
    }

    const events = db.events.filter(e => e.published);
    return res.json(events);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
