require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const MOCK_WORKS = [
  // 3D Modeling
  { 
    type: 'image', url: 'https://picsum.photos/seed/3d1/600/750', title: 'Crystal Golem', description: 'Hard-surface crystalline character with PBR materials.', likes: 312, skill_lane: '3d-modeling',
    industry: 'Game Development', rating: 5.0, order_count: 24, angles: ['https://picsum.photos/seed/3d1b/600/750', 'https://picsum.photos/seed/3d1c/600/750']
  },
  { 
    type: 'image', url: 'https://picsum.photos/seed/3d2/600/750', title: 'Hover Vehicle', description: 'Sci-fi hover bike — low poly game-ready asset.', likes: 189, skill_lane: '3d-modeling',
    industry: 'Game Development', rating: 4.8, order_count: 12, angles: ['https://picsum.photos/seed/3d2b/600/750']
  },
  { 
    type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', thumb: 'https://picsum.photos/seed/3dvid/600/750', title: 'Mesh Sculpt Timelapse', description: '60-second sculpting timelapse from base mesh to final.', likes: 541, skill_lane: '3d-modeling',
    industry: 'Film & Animation', rating: 4.9, order_count: 8
  },
  
  // Map Building
  { 
    type: 'image', url: 'https://picsum.photos/seed/map1/600/750', title: 'Abandoned Facility', description: 'Post-apocalyptic industrial zone with dynamic lighting.', likes: 487, skill_lane: 'map-building',
    industry: 'Architecture', rating: 5.0, order_count: 31, angles: ['https://picsum.photos/seed/map1b/600/750']
  },
  { 
    type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', thumb: 'https://picsum.photos/seed/mapvid/600/750', title: 'World Flythrough', description: 'Cinematic camera sweep across the full map.', likes: 893, skill_lane: 'map-building',
    industry: 'Game Development', rating: 4.9, order_count: 15
  },
  
  // Scripting
  { 
    type: 'image', url: 'https://picsum.photos/seed/sc1/600/750', title: 'Inventory System', description: 'Drag-and-drop inventory with hotbar and persistence.', likes: 412, skill_lane: 'scripting',
    industry: 'Product Design', rating: 5.0, order_count: 42
  },
  
  // GUI
  { 
    type: 'image', url: 'https://picsum.photos/seed/gui1/600/750', title: 'Cyberpunk HUD', description: 'Neon-glitch UI with scanline and flicker shaders.', likes: 534, skill_lane: 'gui-effects',
    industry: 'Game Development', rating: 4.7, order_count: 19
  },
];

async function seed() {
  console.log('Seeding Supabase Database...');
  
  // Clear existing to avoid duplicates if run multiple times
  await supabase.from('portfolio_works').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const { data, error } = await supabase.from('portfolio_works').insert(MOCK_WORKS).select();
  
  if (error) {
    console.error('Error seeding data:', error);
  } else {
    console.log(`Successfully inserted ${data.length} works into Supabase!`);
  }
}

seed();
