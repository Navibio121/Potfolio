-- 1. Insert some dummy works to test the integration!
INSERT INTO portfolio_works (type, url, thumb, title, description, likes, skill_lane)
VALUES 
  ('image', 'https://picsum.photos/seed/3d1/600/750', NULL, 'Crystal Golem', 'Hard-surface crystalline character with PBR materials.', 312, '3d-modeling'),
  ('image', 'https://picsum.photos/seed/3d2/600/750', NULL, 'Hover Vehicle', 'Sci-fi hover bike — low poly game-ready asset.', 189, '3d-modeling'),
  ('video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'https://picsum.photos/seed/3dvid/600/750', 'Mesh Sculpt Timelapse', '60-second sculpting timelapse.', 541, '3d-modeling'),
  
  ('image', 'https://picsum.photos/seed/map1/600/750', NULL, 'Abandoned Facility', 'Post-apocalyptic industrial zone with dynamic lighting.', 487, 'map-building'),
  ('video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 'https://picsum.photos/seed/mapvid/600/750', 'World Flythrough', 'Cinematic camera sweep across the full map.', 893, 'map-building'),
  
  ('image', 'https://picsum.photos/seed/sc1/600/750', NULL, 'Inventory System', 'Drag-and-drop inventory with hotbar and persistence.', 412, 'scripting'),
  ('video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'https://picsum.photos/seed/scvid/600/750', 'AI Pathfinding Demo', 'Custom A* pathfinding with obstacle avoidance.', 722, 'scripting'),
  
  ('image', 'https://picsum.photos/seed/gui1/600/750', NULL, 'Cyberpunk HUD', 'Neon-glitch UI with scanline and flicker shaders.', 534, 'gui-effects'),
  ('video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 'https://picsum.photos/seed/guivid/600/750', 'Menu Animation Pack', 'Spring-physics-driven transitions for main menu screens.', 811, 'gui-effects');
