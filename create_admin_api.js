/**
 * Creates an admin user via Supabase Management API.
 * Run this from the portfolio root: node create_admin_api.js
 */
require('dotenv').config({ path: '.env.local' });
const https = require('https');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Extract project ref from URL: https://bnnbdljatmkwwfvjxctf.supabase.co
const PROJECT_REF = SUPABASE_URL.replace('https://', '').split('.')[0];
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// We'll use whichever key is available
const KEY = SERVICE_ROLE_KEY || ANON_KEY;

const EMAIL = 'busesart9@gmail.com';
const PASSWORD = 'VisionaryPort@2026!';

function makeRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function createAdminUser() {
  console.log('=================================================');
  console.log('  Supabase Admin User Creation');
  console.log('=================================================');
  console.log(`Project: ${PROJECT_REF}`);
  console.log(`Email: ${EMAIL}`);
  console.log('');

  // Try Supabase Auth Admin API (requires service role key)
  const options = {
    hostname: `${PROJECT_REF}.supabase.co`,
    path: '/auth/v1/admin/users',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`,
    }
  };

  const body = {
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,   // Skip email confirmation
    user_metadata: { role: 'admin' }
  };

  console.log('Calling Supabase Auth Admin API...');
  try {
    const result = await makeRequest(options, body);
    
    if (result.status === 200 || result.status === 201) {
      console.log('');
      console.log('✅ SUCCESS! Admin user created.');
      console.log('=================================================');
      console.log(`EMAIL   : ${EMAIL}`);
      console.log(`PASSWORD: ${PASSWORD}`);
      console.log('=================================================');
      console.log('');
      console.log('➡ Go to /admin-gateway and sign in with these credentials.');
      console.log('➡ You can change your password in: Supabase Dashboard > Authentication > Users');
    } else if (result.status === 422 && result.body?.msg?.includes('already registered')) {
      console.log('');
      console.log('ℹ️  User already exists with this email.');
      console.log('➡ Go to /admin-gateway and try signing in.');
      console.log('   If you forgot your password, reset it in Supabase Dashboard.');
    } else {
      console.log('');
      console.log(`❌ Error [${result.status}]:`);
      console.log(JSON.stringify(result.body, null, 2));
      console.log('');
      console.log('ℹ️  This likely means the anon key cannot create users.');
      console.log('You need the SERVICE ROLE KEY. Follow these steps:');
      console.log('  1. Go to https://supabase.com/dashboard/project/bnnbdljatmkwwfvjxctf/settings/api');
      console.log('  2. Copy the "service_role" key (keep it secret!)');
      console.log('  3. Add it to .env.local as: SUPABASE_SERVICE_ROLE_KEY=your_key_here');
      console.log('  4. Re-run this script: node create_admin_api.js');
    }
  } catch (err) {
    console.error('Network error:', err.message);
  }
}

createAdminUser();
