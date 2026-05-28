const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to DB');

    const email = 'busesart9@gmail.com';
    const res = await client.query(
      `UPDATE auth.users 
       SET email_confirmed_at = NOW(), 
           confirmed_at = NOW() 
       WHERE email = $1
       RETURNING id, email, email_confirmed_at;`,
      [email]
    );

    if (res.rows.length > 0) {
      console.log('✅ Email confirmed successfully:', res.rows[0]);
    } else {
      console.log('⚠️ User not found for email:', email);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
