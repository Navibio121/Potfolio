const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function main() {
  // Try using the literal IPv6 address from nslookup
  const connString = "postgresql://postgres:Omonla%40%24123@[2a05:d018:1b65:3000:5bdc:d0f0:a43f:a49d]:5432/postgres";
  
  const client = new Client({
    connectionString: connString,
  });

  try {
    console.log('Connecting to DB via IPv6 address...');
    await client.connect();
    console.log('Connected to DB!');

    const email = 'busesart9@gmail.com';
    const res = await client.query(
      `UPDATE auth.users 
       SET email_confirmed_at = NOW(), 
           confirmed_at = NOW(),
           last_sign_in_at = NOW()
       WHERE email = $1
       RETURNING id, email, email_confirmed_at;`,
      [email]
    );

    if (res.rows.length > 0) {
      console.log('✅ Email confirmed successfully via direct DB update:', res.rows[0]);
    } else {
      console.log('⚠️ User not found for email:', email);
    }
  } catch (err) {
    console.error('Connection Error:', err.message);
    if (err.code === 'ENETUNREACH') {
      console.error('Network unreachable - likely no IPv6 support on this machine.');
    }
  } finally {
    await client.end();
  }
}

main();
