const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  await client.connect();
  try {
    console.log("Executing SQL updates...");
    await client.query(`
      -- 1. Add premium columns to portfolio_works
      ALTER TABLE portfolio_works ADD COLUMN IF NOT EXISTS angles JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE portfolio_works ADD COLUMN IF NOT EXISTS industry TEXT;
      ALTER TABLE portfolio_works ADD COLUMN IF NOT EXISTS rating DECIMAL DEFAULT 5.0;
      ALTER TABLE portfolio_works ADD COLUMN IF NOT EXISTS order_count INT DEFAULT 0;

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
      
      DROP POLICY IF EXISTS "Public testimonials are viewable by everyone." ON client_testimonials;
      CREATE POLICY "Public testimonials are viewable by everyone." ON client_testimonials FOR SELECT USING (true);
      
      DROP POLICY IF EXISTS "Anyone can modify testimonials" ON client_testimonials;
      CREATE POLICY "Anyone can modify testimonials" ON client_testimonials FOR ALL USING (true) WITH CHECK (true);

      -- 4. Create Storage Bucket for Images
      INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-media', 'portfolio-media', true) ON CONFLICT (id) DO NOTHING;

      -- Storage Policies
      DROP POLICY IF EXISTS "Public Access" ON storage.objects;
      CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'portfolio-media' );
      
      DROP POLICY IF EXISTS "Admin Insert" ON storage.objects;
      CREATE POLICY "Admin Insert" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'portfolio-media' );
      
      DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
      CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'portfolio-media' );
      
      DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
      CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'portfolio-media' );
    `);
    console.log("Success! Database schema updated.");
  } catch (e) {
    console.error("SQL Error:", e);
  } finally {
    await client.end();
  }
}
run();
