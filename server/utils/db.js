const { db, initialData } = require('../../lib/db');

module.exports = {
  db,
  initialData,
  // Keep legacy names for easier migration if needed, but they are now async proxies
  async readDb() {
    // This is problematic as legacy code expects a synchronous full object
    // But since we are refactoring routes to async, we will use the 'db' interface directly.
    // However, if some code still needs the full object (like auth login):
    const [
      users, events, pressReleases, announcements, 
      photos, videos, documents, settings, 
      councils, regionalCouncils, mapData
    ] = await Promise.all([
      db.get('users'),
      db.get('events'),
      db.get('press_releases'),
      db.get('announcements'),
      db.get('photos'),
      db.get('videos'),
      db.get('documents'),
      db.getSettings(),
      db.get('councils'),
      db.get('regional_councils'),
      db.get('map_data')
    ]);

    return {
      users, events, pressReleases, announcements,
      photos, videos, documents, settings,
      councils, regionalCouncils, mapData
    };
  }
};
