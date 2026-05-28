-- Copy and paste this into the Supabase SQL Editor to create your tables

-- 1. Create the Portfolio Work table
CREATE TABLE portfolio_works (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  thumb TEXT,
  title TEXT NOT NULL,
  description TEXT,
  likes INT DEFAULT 0,
  skill_lane TEXT NOT NULL, -- e.g. '3d-modeling'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the Contact Messages table
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  discord_handle TEXT,
  social_handle TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Set up Row Level Security (RLS)
-- Allow anyone to read the portfolio works
ALTER TABLE portfolio_works ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone."
  ON portfolio_works FOR SELECT
  USING ( true );

-- Allow anyone to insert contact messages (but not read them)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a message"
  ON contact_messages FOR INSERT
  WITH CHECK ( true );
