const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  await client.connect();
  try {
    console.log("Creating artist_settings table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS artist_settings (
        id SERIAL PRIMARY KEY,
        name TEXT,
        handle TEXT,
        bio TEXT,
        pronouns TEXT,
        gender TEXT,
        is_available BOOLEAN DEFAULT true,
        discord TEXT,
        twitter TEXT,
        instagram TEXT,
        artstation TEXT,
        payment_methods JSONB DEFAULT '[]'::jsonb,
        tech_stack JSONB DEFAULT '[]'::jsonb,
        pricing_tiers JSONB DEFAULT '[]'::jsonb,
        profile_image TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      ALTER TABLE artist_settings ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Anyone can update settings" ON artist_settings;
      CREATE POLICY "Anyone can update settings" ON artist_settings FOR UPDATE USING (true);

      DROP POLICY IF EXISTS "Anyone can select settings" ON artist_settings;
      CREATE POLICY "Anyone can select settings" ON artist_settings FOR SELECT USING (true);

      DROP POLICY IF EXISTS "Anyone can insert settings" ON artist_settings;
      CREATE POLICY "Anyone can insert settings" ON artist_settings FOR INSERT WITH CHECK (true);

      INSERT INTO artist_settings (id, payment_methods, tech_stack, pricing_tiers)
      VALUES (1, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log("Success! artist_settings created and seeded.");
  } catch (e) {
    console.error("SQL Error:", e);
  } finally {
    await client.end();
  }
}
run();
