-- Create a table for artist settings (Social Links)
CREATE TABLE artist_settings (
  id INT PRIMARY KEY DEFAULT 1,
  discord TEXT DEFAULT '',
  twitter TEXT DEFAULT '',
  instagram TEXT DEFAULT '',
  artstation TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert the default row
INSERT INTO artist_settings (id, discord, twitter, instagram, artstation)
VALUES (1, 'ariavoss#0001', '@ariavoss', '@aria.voss.art', 'artstation.com/ariavoss')
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
ALTER TABLE artist_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone."
  ON artist_settings FOR SELECT
  USING ( true );

-- Allow public update access for the demo (in production, secure this!)
CREATE POLICY "Anyone can update settings"
  ON artist_settings FOR UPDATE
  USING ( true );
