const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
  const email = 'busesart9@gmail.com';
  const password = 'Omonla@123';

  console.log(`Testing signup for ${email}...`);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Signup Error:', error.message);
    console.error('Error Details:', error);
  } else {
    console.log('Signup Result:', JSON.stringify(data, null, 2));
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      console.log('Warning: User already exists but identities are empty?');
    }
  }
}

testSignup();
