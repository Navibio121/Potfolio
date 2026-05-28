const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Add angles column to portfolio_works
    await client.query(`
      ALTER TABLE portfolio_works 
      ADD COLUMN IF NOT EXISTS angles JSONB DEFAULT '[]'::jsonb;
    `);
    console.log('Added angles column to portfolio_works');

  } catch (err) {
    console.error('Error executing migration:', err);
  } finally {
    await client.end();
  }
}

main();
