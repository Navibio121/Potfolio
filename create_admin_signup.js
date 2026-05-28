/**
 * Creates admin account via Supabase Auth signup with user's chosen password.
 */
require('dotenv').config({ path: '.env.local' });
const https = require('https');

const PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const HOSTNAME = PROJECT_URL.replace('https://', '');

const EMAIL = 'busesart9@gmail.com';
const PASSWORD = 'Omonla@123';

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: HOSTNAME,
      path,
      method: 'POST',
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
  console.log('');
  console.log('=================================================');
  console.log('  Creating Admin Account');
  console.log('=================================================');
  console.log(`Email:    ${EMAIL}`);
  console.log(`Password: ${'*'.repeat(PASSWORD.length)}`);
  console.log('');

  // First, try to sign in (in case user already exists)
  console.log('Step 1: Checking if account already exists...');
  const loginRes = await post('/auth/v1/token?grant_type=password', {
    email: EMAIL,
    password: PASSWORD,
  });

  if (loginRes.status === 200 && loginRes.body?.access_token) {
    console.log('✅ Account already exists and login works!');
    console.log('');
    console.log('=================================================');
    console.log('  You can log in at /admin-gateway now!');
    console.log('=================================================');
    return;
  }

  // Try signup
  console.log('Step 2: Creating new account...');
  const signupRes = await post('/auth/v1/signup', {
    email: EMAIL,
    password: PASSWORD,
  });

  if (signupRes.status === 200 && signupRes.body?.id) {
    console.log('✅ Account created! User ID:', signupRes.body.id);
    
    if (signupRes.body.confirmed_at || signupRes.body.email_confirmed_at) {
      console.log('✅ Email confirmed — ready to log in!');
    } else {
      // Check if we can log in anyway (confirmation disabled)
      console.log('');
      console.log('Step 3: Testing login...');
      const testLogin = await post('/auth/v1/token?grant_type=password', {
        email: EMAIL,
        password: PASSWORD,
      });
      
      if (testLogin.status === 200 && testLogin.body?.access_token) {
        console.log('✅ Login works! Email confirmation not required.');
      } else {
        console.log('⚠️  Email confirmation may still be required.');
        console.log('   Go to Supabase Dashboard > Auth > Providers > Email');
        console.log('   Toggle OFF "Confirm email", then try again.');
      }
    }
  } else if (signupRes.body?.msg?.includes('already') || 
             (typeof signupRes.body === 'object' && JSON.stringify(signupRes.body).includes('already'))) {
    console.log('ℹ️  Email already registered.');
    console.log('   The old account may have a different password.');
    console.log('   Delete it in Supabase Dashboard > Auth > Users, then re-run.');
  } else {
    console.log('Response:', JSON.stringify(signupRes.body, null, 2));
  }

  console.log('');
  console.log('=================================================');
  console.log('  Login URL: http://localhost:3000/admin-gateway');
  console.log('=================================================');
}

main().catch(console.error);
