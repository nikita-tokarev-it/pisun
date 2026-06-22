-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  "passwordHash" TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor',
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- 2. Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT,
  title TEXT NOT NULL,
  date DATE,
  image TEXT,
  description TEXT,
  "fullContent" TEXT,
  published BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

-- 3. Press Releases table
CREATE TABLE IF NOT EXISTS press_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE,
  description TEXT,
  "fullContent" TEXT,
  published BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

-- 4. Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE,
  description TEXT,
  "fullContent" TEXT,
  published BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

-- 5. Photos table
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  date DATE,
  image TEXT,
  published BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- 6. Videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  date DATE,
  thumbnail TEXT,
  "videoUrl" TEXT,
  published BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- 7. Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT,
  title TEXT NOT NULL,
  file TEXT,
  date DATE,
  published BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

-- 8. Settings table (Key-Value)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- 9. Councils table
CREATE TABLE IF NOT EXISTS councils (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position INTEGER DEFAULT 0,
  group_position INTEGER DEFAULT 0,
  council TEXT,
  chairman TEXT,
  secretary TEXT,
  website TEXT,
  university TEXT
);

-- 10. Regional Councils table
CREATE TABLE IF NOT EXISTS regional_councils (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position INTEGER DEFAULT 0,
  group_position INTEGER DEFAULT 0,
  region TEXT,
  organization TEXT,
  position_name TEXT,
  chairman TEXT,
  phone TEXT,
  email TEXT,
  subordination TEXT,
  website TEXT
);

-- 11. Map Data table
CREATE TABLE IF NOT EXISTS map_data (
  id TEXT PRIMARY KEY, -- Using region codes like RU-SA
  name TEXT,
  info TEXT,
  universities JSONB,
  website TEXT,
  highlight BOOLEAN DEFAULT false
);

-- 12. Row Level Security (RLS) - Basic disable for this migration
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE press_releases DISABLE ROW LEVEL SECURITY;
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE photos DISABLE ROW LEVEL SECURITY;
ALTER TABLE videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE councils DISABLE ROW LEVEL SECURITY;
ALTER TABLE regional_councils DISABLE ROW LEVEL SECURITY;
ALTER TABLE map_data DISABLE ROW LEVEL SECURITY;

-- 13. Initial Admin User (password: admin123)
INSERT INTO users (username, email, "passwordHash", role)
VALUES ('admin', 'admin@dvfu-rectorat.ru', '$2a$10$DEbRI4NJwPnXWd/H6ldgROf.Rna6Q4TEO4w0TM/uj7.C6.LID2oO', 'admin')
ON CONFLICT (username) DO NOTHING;
