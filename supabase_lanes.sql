-- 1. Create the Skill Lanes table
CREATE TABLE skill_lanes (
  id TEXT PRIMARY KEY, -- e.g., '3d-modeling'
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  level TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Insert the defaults
INSERT INTO skill_lanes (id, name, icon, description, level, color) VALUES
('3d-modeling', '3D Modeling', '🧊', 'High-fidelity mesh creation, UV unwrapping, and texture baking.', 'Expert', '#a78bfa'),
('map-building', 'Map Building', '🗺️', 'Large-scale world environments, terrain sculpting, and atmospheric scene composition.', 'Expert', '#34d399'),
('scripting', 'Scripting', '⚙️', 'Lua-based game mechanics, data systems, UI controllers, and server-client architecture.', 'Pro', '#60a5fa'),
('gui-effects', 'GUI & Effects', '✨', 'Premium user interfaces, particle effects, screen-space post-processing, and animated HUDs.', 'Pro', '#f472b6'),
('animation', 'Animation', '🎬', 'Character rigs, cutscene direction, and procedural motion.', 'Intermediate', '#fb923c');

-- 3. Setup Row Level Security (RLS)
ALTER TABLE skill_lanes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public lanes are viewable by everyone."
  ON skill_lanes FOR SELECT USING ( true );
  
CREATE POLICY "Anyone can modify lanes"
  ON skill_lanes FOR ALL USING ( true ) WITH CHECK ( true );
