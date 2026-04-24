const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events').router);
app.use('/api/press-releases', require('./routes/pressReleases').router);
app.use('/api/announcements', require('./routes/announcements').router);
app.use('/api/photos', require('./routes/photos').router);
app.use('/api/videos', require('./routes/videos').router);
app.use('/api/documents', require('./routes/documents').router);
app.use('/api/settings', require('./routes/settings').router);
app.use('/api/councils', require('./routes/councils').router);
app.use('/api/map', require('./routes/map').router);

// Admin routes
app.use('/api/admin/events', require('./routes/events').adminRouter);
app.use('/api/admin/press-releases', require('./routes/pressReleases').adminRouter);
app.use('/api/admin/announcements', require('./routes/announcements').adminRouter);
app.use('/api/admin/photos', require('./routes/photos').adminRouter);
app.use('/api/admin/videos', require('./routes/videos').adminRouter);
app.use('/api/admin/documents', require('./routes/documents').adminRouter);
app.use('/api/admin/users', require('./routes/users'));
app.use('/api/admin/settings', require('./routes/settings').adminRouter);
app.use('/api/admin/councils', require('./routes/councils').adminRouter);
app.use('/api/admin/map', require('./routes/map').adminRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
