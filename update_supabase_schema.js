require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function updateWorks() {
  console.log('Updating portfolio works with extra data...');

  // 1. Fetch all works
  const { data: works, error: fetchError } = await supabase.from('portfolio_works').select('*');
  
  if (fetchError) {
    console.error('Error fetching works:', fetchError);
    return;
  }

  console.log(`Found ${works.length} works. Updating...`);

  for (const work of works) {
    // Add some random angles (extra images)
    const angles = [
      `https://picsum.photos/seed/${work.id}a/800/600`,
      `https://picsum.photos/seed/${work.id}b/800/600`,
    ];

    // Add a random rating and industry if not present (though we handle this in frontend, let's keep it consistent)
    const { error: updateError } = await supabase
      .from('portfolio_works')
      .update({ 
        // We'll use a JSONB column if it exists, but the table doesn't have it.
        // Let's check if we can add it or just rely on frontend mapping.
      })
      .eq('id', work.id);

    // Since we don't have an 'angles' column in the current schema, let's add it!
  }
}

// Instead of updating rows one by one with columns that don't exist, 
// let's first ensure the schema is ready for the "Premium" features.

async function updateSchema() {
  console.log('You should run this SQL in your Supabase SQL Editor:');
  console.log(`
    ALTER TABLE portfolio_works ADD COLUMN IF NOT EXISTS angles TEXT[];
    ALTER TABLE portfolio_works ADD COLUMN IF NOT EXISTS industry TEXT;
    ALTER TABLE portfolio_works ADD COLUMN IF NOT EXISTS rating DECIMAL DEFAULT 5.0;
    ALTER TABLE portfolio_works ADD COLUMN IF NOT EXISTS order_count INT DEFAULT 0;
  `);
}

updateSchema();
