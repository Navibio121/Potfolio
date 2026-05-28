const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

async function runUpdates() {
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to Supabase DB.');

    // 1. Add angles column if not exists
    console.log('Ensuring "angles" column exists...');
    await client.query(`
      ALTER TABLE portfolio_works 
      ADD COLUMN IF NOT EXISTS angles JSONB DEFAULT '[]'::jsonb;
    `);

    // 2. Add short_tag column if not exists
    console.log('Ensuring "short_tag" column exists...');
    await client.query(`
      ALTER TABLE portfolio_works 
      ADD COLUMN IF NOT EXISTS short_tag TEXT;
    `);

    // 3. Fix RLS policies
    console.log('Fixing RLS policies...');
    await client.query(`
      ALTER TABLE portfolio_works ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Anyone can insert works" ON portfolio_works;
      CREATE POLICY "Anyone can insert works" ON portfolio_works FOR INSERT WITH CHECK (true);
      DROP POLICY IF EXISTS "Anyone can update works" ON portfolio_works;
      CREATE POLICY "Anyone can update works" ON portfolio_works FOR UPDATE USING (true);
      DROP POLICY IF EXISTS "Anyone can delete works" ON portfolio_works;
      CREATE POLICY "Anyone can delete works" ON portfolio_works FOR DELETE USING (true);
      DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON portfolio_works;
      CREATE POLICY "Public profiles are viewable by everyone." ON portfolio_works FOR SELECT USING (true);
    `);

    console.log('All updates applied successfully!');
  } catch (err) {
    console.error('Error running updates:', err);
  } finally {
    await client.end();
  }
}

runUpdates();
