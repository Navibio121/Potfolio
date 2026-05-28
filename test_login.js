/**
 * Test login with both possible passwords
 */
require('dotenv').config({ path: '.env.local' });
const https = require('https');

const HOSTNAME = process.env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', '');
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const EMAIL = 'busesart9@gmail.com';

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: HOSTNAME, path, method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
      }
    }, (res) => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('Testing login for:', EMAIL);
  console.log('');

  // Try password 1
  console.log('Trying password: VisionaryPort@2026! ...');
  const r1 = await post('/auth/v1/token?grant_type=password', {
    email: EMAIL, password: 'VisionaryPort@2026!',
  });
  if (r1.status === 200 && r1.body?.access_token) {
    console.log('✅ LOGIN WORKS with: VisionaryPort@2026!');
    console.log('   User ID:', r1.body.user?.id);
    return;
  }
  console.log('   ❌ Failed:', r1.body?.msg || r1.body?.error_description || JSON.stringify(r1.body));

  // Try password 2
  console.log('');
  console.log('Trying password: Omonla@123 ...');
  const r2 = await post('/auth/v1/token?grant_type=password', {
    email: EMAIL, password: 'Omonla@123',
  });
  if (r2.status === 200 && r2.body?.access_token) {
    console.log('✅ LOGIN WORKS with: Omonla@123');
    console.log('   User ID:', r2.body.user?.id);
    return;
  }
  console.log('   ❌ Failed:', r2.body?.msg || r2.body?.error_description || JSON.stringify(r2.body));

  console.log('');
  console.log('Neither password worked. The account likely needs email confirmation.');
  console.log('Go to: https://supabase.com/dashboard/project/bnnbdljatmkwwfvjxctf/auth/users');
  console.log('and confirm or delete the user, then re-run create_admin_signup.js');
}

main().catch(console.error);
