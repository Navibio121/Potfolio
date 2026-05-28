const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsertNoAngles() {
  console.log('Testing insert without angles...');
  const { data, error } = await supabase.from('portfolio_works').insert([{
    title: 'Test Project No Angles',
    skill_lane: 'Game Art',
    description: 'Testing insert without angles column',
    url: 'https://example.com/image.jpg',
    type: 'image'
  }]);

  if (error) {
    console.error('Insert failed:', error);
  } else {
    console.log('Insert successful:', data);
  }
}

testInsertNoAngles();
