const { db } = require('../lib/db');

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

    const { collection, id } = req.query;

    // Normalize collection name for DB (snake_case)
    let tableName = collection;
    if (collection === 'pressReleases') {
      tableName = 'press_releases';
    } else if (collection === 'mapData') {
      tableName = 'map_data';
    }

    if (collection === 'councils') {
      const [councils, regionalCouncils] = await Promise.all([
        db.get('councils'),
        db.get('regional_councils')
      ]);
      return res.json({ councils, regionalCouncils });
    }

    if (collection === 'settings') {
      const settings = await db.getSettings();
      return res.json(settings);
    }

    const filters = { published: true };
    // For map_data, we don't have published field in the original schema but let's be safe
    if (tableName === 'map_data') delete filters.published;

    const results = await db.get(tableName, id, filters);
    
    if (!results && id) return res.status(404).json({ error: 'Not found' });
    
    return res.json(results);
  } catch (error) {
    console.error(`Public API Handler Error (${req.query.collection}):`, error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
