const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createAdmin() {
  console.log('Connecting to Supabase Database...');
  await client.connect();
  
  try {
    const email = 'busesart9@gmail.com';
    const password = 'AdminPassword123!'; // Default password
    
    console.log(`Checking if user ${email} already exists...`);
    const checkRes = await client.query('SELECT id FROM auth.users WHERE email = $1', [email]);
    
    if (checkRes.rows.length > 0) {
      console.log('User already exists in auth.users.');
    } else {
      console.log('Creating new admin user...');
      const sql = `
        INSERT INTO auth.users (
          instance_id, id, aud, role, email, encrypted_password, 
          email_confirmed_at, recovery_sent_at, last_sign_in_at, 
          raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
          confirmation_token, email_change, email_change_token_new, recovery_token
        )
        VALUES (
          '00000000-0000-0000-0000-000000000000',
          gen_random_uuid(),
          'authenticated',
          'authenticated',
          $1,
          crypt($2, gen_salt('bf')),
          now(),
          now(),
          now(),
          '{"provider":"email","providers":["email"]}',
          '{}',
          now(),
          now(),
          '',
          '',
          '',
          ''
        )
      `;
      await client.query(sql, [email, password]);
      console.log('✅ Admin account successfully created in auth.users.');
    }

    // Also ensure the identity is created for Supabase Auth to recognize it properly
    const userIdRes = await client.query('SELECT id FROM auth.users WHERE email = $1', [email]);
    const userId = userIdRes.rows[0].id;

    const checkIdentity = await client.query('SELECT id FROM auth.identities WHERE user_id = $1', [userId]);
    if (checkIdentity.rows.length === 0) {
      console.log('Creating identity mapping...');
      const identitySql = `
        INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
        VALUES (
          gen_random_uuid(),
          $1,
          jsonb_build_object('sub', $1, 'email', $2),
          'email',
          now(),
          now(),
          now()
        )
      `;
      await client.query(identitySql, [userId, email]);
      console.log('✅ Identity mapping created.');
    }

    console.log('\n--------------------------------------------------');
    console.log(`EMAIL: ${email}`);
    console.log(`PASSWORD: ${password}`);
    console.log('--------------------------------------------------');
    console.log('IMPORTANT: You can now log in at /admin-gateway.');
    console.log('Please change your password immediately in the Supabase Dashboard.');
    
  } catch (err) {
    console.error('❌ Error during setup:', err.message);
  } finally {
    await client.end();
  }
}

createAdmin();
