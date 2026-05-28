const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  console.log('Testing insert into portfolio_works...');
  const { data, error } = await supabase.from('portfolio_works').insert([{
    title: 'Test Project',
    skill_lane: 'Game Art',
    description: 'Testing insert from script',
    url: 'https://example.com/image.jpg',
    angles: [],
    type: 'image'
  }]);

  if (error) {
    console.error('Insert failed:', error);
  } else {
    console.log('Insert successful:', data);
  }
}

testInsert();
