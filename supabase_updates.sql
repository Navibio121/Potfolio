-- 1. Add angles to portfolio_works
ALTER TABLE portfolio_works ADD COLUMN IF NOT EXISTS angles JSONB DEFAULT '[]'::jsonb;

-- 2. Add profile_image to artist_settings
ALTER TABLE artist_settings ADD COLUMN IF NOT EXISTS profile_image TEXT;

-- 3. Create testimonials table
CREATE TABLE IF NOT EXISTS client_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  role TEXT,
  feedback TEXT NOT NULL,
  image_url TEXT,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for testimonials
ALTER TABLE client_testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public testimonials are viewable by everyone." ON client_testimonials FOR SELECT USING (true);
CREATE POLICY "Anyone can modify testimonials" ON client_testimonials FOR ALL USING (true) WITH CHECK (true);

-- 4. Create Storage Bucket for Images
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-media', 'portfolio-media', true) ON CONFLICT DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'portfolio-media' );
CREATE POLICY "Admin Insert" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'portfolio-media' );
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'portfolio-media' );
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'portfolio-media' );
