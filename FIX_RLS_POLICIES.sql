-- RUN THIS IN THE SUPABASE SQL EDITOR
-- This script fixes RLS policies to allow the admin (and local bypass) to modify data.

-- 1. Portfolio Works
ALTER TABLE portfolio_works ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert works" ON portfolio_works;
CREATE POLICY "Anyone can insert works" ON portfolio_works FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update works" ON portfolio_works;
CREATE POLICY "Anyone can update works" ON portfolio_works FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete works" ON portfolio_works;
CREATE POLICY "Anyone can delete works" ON portfolio_works FOR DELETE USING (true);

-- 2. Artist Settings
ALTER TABLE artist_settings ENABLE ROW LEVEL SECURITY;

-- Add JSON columns for flexible data if they don't exist
ALTER TABLE artist_settings ADD COLUMN IF NOT EXISTS tech_stack JSONB DEFAULT '[]'::jsonb;
ALTER TABLE artist_settings ADD COLUMN IF NOT EXISTS pricing_tiers JSONB DEFAULT '[]'::jsonb;
ALTER TABLE artist_settings ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE artist_settings ADD COLUMN IF NOT EXISTS handle TEXT;
ALTER TABLE artist_settings ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE artist_settings ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE artist_settings ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

DROP POLICY IF EXISTS "Anyone can update settings" ON artist_settings;
CREATE POLICY "Anyone can update settings" ON artist_settings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can select settings" ON artist_settings;
CREATE POLICY "Anyone can select settings" ON artist_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert settings" ON artist_settings;
CREATE POLICY "Anyone can insert settings" ON artist_settings FOR INSERT WITH CHECK (true);

-- 3. Tech Stack / Skills (If you have a table, otherwise it uses artist_settings)
-- Assuming tech stack is stored in artist_settings as JSON or a separate table.
-- If you create a 'tech_stack' table later, run:
-- ALTER TABLE tech_stack ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Anyone can modify tech_stack" ON tech_stack FOR ALL USING (true) WITH CHECK (true);

-- 4. Storage Bucket Policies (Fixing them to be truly public for this project)
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'portfolio-media' );

DROP POLICY IF EXISTS "Public Update" ON storage.objects;
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'portfolio-media' );

DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'portfolio-media' );
