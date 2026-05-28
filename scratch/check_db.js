const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDb() {
  console.log('Checking portfolio_works table...');
  const { data, error } = await supabase.from('portfolio_works').select('*');
  if (error) {
    console.error('Error fetching projects:', error);
  } else {
    console.log('Projects in DB:', data.length);
    data.forEach(p => console.log(`- ${p.title} (${p.id})`));
  }
}

checkDb();
