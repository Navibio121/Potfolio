const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function finalDbCheck() {
  console.log('Testing full insert into portfolio_works...');
  const testProject = {
    title: 'Final Test Project',
    skill_lane: 'Environments',
    description: 'This is a test project to verify all columns and RLS.',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    angles: ['https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05'],
    short_tag: 'Test Tag',
    type: 'image'
  };

  const { data, error } = await supabase.from('portfolio_works').insert([testProject]).select();

  if (error) {
    console.error('Insert failed:', error);
  } else {
    console.log('Insert SUCCESSFUL:', data);
    console.log('Verifying fetch...');
    const { data: fetchResult } = await supabase.from('portfolio_works').select('*').eq('id', data[0].id);
    console.log('Fetched project:', fetchResult);
  }
}

finalDbCheck();
