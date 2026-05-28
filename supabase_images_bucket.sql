-- 1. Create the 'images' bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow public access to view images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'images' );

-- 3. Allow authenticated or public uploads
CREATE POLICY "Public Uploads" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'images' );

-- 4. Allow authenticated or public updates
CREATE POLICY "Public Updates" ON storage.objects FOR UPDATE USING ( bucket_id = 'images' );

-- 5. Allow authenticated or public deletes
CREATE POLICY "Public Deletes" ON storage.objects FOR DELETE USING ( bucket_id = 'images' );
