'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Upload, X, Image as ImageIcon, Tag, FileText, AlignLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const CATEGORIES = ['Game Art', 'UI Design', 'Environments', 'Scripts'];
const BUCKET = 'images';

interface MediaItem {
  previewUrl: string;   // local blob URL for instant preview
  publicUrl: string;    // final Supabase public URL (empty until upload done)
  uploaded: boolean;
  name: string;
  file?: File;          // Store the actual file object
}

interface FormState {
  title: string;
  industry: string;
  description: string;
  coverUrl: string;     // typed URL field
  short_tag: string;
}

export default function AddProjectCard({ onSaved }: { onSaved: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    title: '', industry: 'Game Art', description: '', coverUrl: '', short_tag: '',
  });

  const reset = () => {
    // Revoke blob URLs to free memory
    mediaItems.forEach(m => URL.revokeObjectURL(m.previewUrl));
    setMediaItems([]);
    setForm({ title: '', industry: 'Game Art', description: '', coverUrl: '', short_tag: '' });
    setUploadProgress(0);
    setDone(false);
    setExpanded(false);
  };

  /* ── Handle file selection → instant preview ── */
  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newItems: MediaItem[] = files.map(f => ({
      previewUrl: URL.createObjectURL(f),
      publicUrl: '',
      uploaded: false,
      name: f.name,
      file: f, // Store the file
    }));

    setMediaItems(prev => [...prev, ...newItems]);
    // Reset input so same files can be re-added if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeMedia = (idx: number) => {
    const item = mediaItems[idx];
    URL.revokeObjectURL(item.previewUrl);
    setMediaItems(prev => prev.filter((_, i) => i !== idx));
  };

  /* ── Upload all pending files to Supabase Storage ── */
  const uploadAllFiles = async (items: MediaItem[]): Promise<string[]> => {
    const filesToUpload = items.map(m => m.file).filter((f): f is File => !!f);
    if (filesToUpload.length === 0) return [];
    
    const urls: string[] = [];

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `portfolio/${Date.now()}_${i}.${ext}`;

      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });

      if (error) {
        console.error('Storage upload error:', error.message);
        throw new Error(`Upload failed for ${file.name}: ${error.message}`);
      } else {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        urls.push(data.publicUrl);
      }

      setUploadProgress(Math.round(((i + 1) / filesToUpload.length) * 100));
    }

    return urls;
  };

  /* ── Submit ── */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasCover = form.coverUrl.trim() !== '';
    const hasFiles = mediaItems.length > 0;

    if (!form.title.trim()) {
      alert('Please enter a project title.');
      return;
    }
    if (!hasCover && !hasFiles) {
      alert('Please provide at least one image (URL or uploaded file).');
      return;
    }

    setSaving(true);

    try {
      // Upload any selected files
      let uploadedUrls: string[] = [];
      if (hasFiles) {
        console.log('Starting upload of', mediaItems.length, 'files...');
        uploadedUrls = await uploadAllFiles(mediaItems);
        console.log('Upload complete. URLs:', uploadedUrls);
      }

      // Combine URL + uploads
      const allUrls = [
        ...(hasCover ? [form.coverUrl.trim()] : []),
        ...uploadedUrls,
      ].filter(Boolean);

      if (allUrls.length === 0) {
        alert('No valid images were provided or uploaded.');
        setSaving(false);
        return;
      }

      const primaryUrl = allUrls[0];
      const anglesUrls = allUrls.slice(1);

      console.log('Inserting into DB:', { title: form.title, url: primaryUrl });
      const { error } = await supabase.from('portfolio_works').insert([{
        title: form.title.trim(),
        skill_lane: form.industry,
        description: form.description.trim(),
        url: primaryUrl,
        angles: anglesUrls,
        short_tag: form.short_tag.trim(),
        type: 'image',
      }]);

      if (error) {
        // If the error is about a missing column, try inserting without it
        if (error.message.includes('angles') || error.message.includes('short_tag')) {
          console.warn('Retrying insert without extended columns...');
          const { error: retryError } = await supabase.from('portfolio_works').insert([{
            title: form.title.trim(),
            skill_lane: form.industry,
            description: form.description.trim(),
            url: primaryUrl,
            type: 'image',
          }]);
          if (retryError) throw retryError;
        } else {
          throw error;
        }
      }

      setDone(true);
      console.log('Project created successfully. Refreshing list...');
      
      // Refresh the data immediately
      onSaved();

      // Scroll to the portfolio grid so the user sees the new item
      const grid = document.getElementById('portfolio-grid');
      if (grid) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Close the form after a short delay
      setTimeout(() => {
        reset();
      }, 1000);
    } catch (err: any) {
      console.error('Project creation failed:', err);
      alert(`Failed to create project: ${err.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        border: '1px dashed rgba(var(--accent-rgb), 0.3)',
        borderRadius: '12px',
        background: 'rgba(var(--accent-rgb), 0.05)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: expanded ? 'auto' : '200px',
      }}
    >
      {/* ── Collapsed trigger ── */}
      {!expanded && !done && (
        <button
          onClick={() => setExpanded(true)}
          style={{
            flex: 1, background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: '0.75rem', padding: '2.5rem',
            color: 'rgba(var(--accent-rgb), 0.8)', transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--accent)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(var(--accent-rgb), 0.8)'}
        >
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            border: '2px dashed currentColor',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Plus size={28} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.12em' }}>
            ADD NEW PROJECT
          </span>
        </button>
      )}

      {/* ── Success state ── */}
      {done && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '2.5rem', gap: '0.75rem',
        }}>
          <CheckCircle2 size={48} color="var(--accent)" />
          <p style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.1em' }}>
            PROJECT CREATED!
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
            It will appear in the grid now.
          </p>
        </div>
      )}

      {/* ── Form ── */}
      <AnimatePresence>
        {expanded && !done && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSave}
            style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            {/* Header */}
            <div style={{
              padding: '1.25rem 1.25rem 1rem',
              borderBottom: '1px solid rgba(var(--accent-rgb), 0.15)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '0.15em' }}>
                NEW PROJECT
              </span>
              <button type="button" onClick={reset} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* ── Title ── */}
              <Field icon={<AlignLeft size={14} />} label="HEADLINE / TITLE *">
                <input
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="cinema-input"
                  placeholder="e.g. Ingame Architecture"
                  style={{ fontSize: '0.85rem', padding: '10px 14px' }}
                />
              </Field>

              {/* ── Category ── */}
              <Field icon={<Tag size={14} />} label="CATEGORY">
                <select
                  value={form.industry}
                  onChange={e => setForm({ ...form, industry: e.target.value })}
                  className="cinema-input"
                  style={{ fontSize: '0.85rem', padding: '10px 14px' }}
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>

              {/* ── Cover Image URL ── */}
              <Field icon={<ImageIcon size={14} />} label="COVER IMAGE URL (optional if uploading)">
                <input
                  value={form.coverUrl}
                  onChange={e => setForm({ ...form, coverUrl: e.target.value })}
                  className="cinema-input"
                  placeholder="https://your-image-url.com/photo.jpg"
                  style={{ fontSize: '0.85rem', padding: '10px 14px' }}
                />
                {form.coverUrl && (
                  <div style={{ marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/9', background: '#111' }}>
                    <img
                      src={form.coverUrl}
                      alt="preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
              </Field>

              {/* ── File Upload ── */}
              <Field icon={<Upload size={14} />} label="UPLOAD MEDIA (3–5 images/videos recommended)">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '1px dashed rgba(var(--accent-rgb), 0.3)',
                    borderRadius: '10px', padding: '1.5rem',
                    textAlign: 'center', cursor: 'pointer',
                    background: 'rgba(var(--accent-rgb), 0.05)',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(var(--accent-rgb), 0.5)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(var(--accent-rgb), 0.1)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(var(--accent-rgb), 0.3)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(var(--accent-rgb), 0.05)';
                  }}
                >
                  <Upload size={20} color="var(--accent)" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600 }}>
                    Click to select files
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.7rem', marginTop: '4px' }}>
                    JPG, PNG, GIF, WEBP, MP4 supported
                  </div>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFilePick}
                  style={{ display: 'none' }}
                />

                {/* Preview thumbnails */}
                {mediaItems.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                    {mediaItems.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: 'relative', width: 64, height: 64,
                          borderRadius: 8, overflow: 'hidden',
                          border: `2px solid rgba(var(--accent-rgb), 0.2)`,
                        }}
                      >
                        <img
                          src={item.previewUrl}
                          alt={`preview-${idx}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          onClick={() => removeMedia(idx)}
                          style={{
                            position: 'absolute', top: 0, right: 0,
                            background: 'rgba(239,68,68,0.85)', border: 'none',
                            color: '#fff', cursor: 'pointer', padding: '2px',
                            lineHeight: 1, borderRadius: '0 0 0 4px',
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Field>

              {/* ── Short Tag ── */}
              <Field icon={<Tag size={14} />} label="SHORT TAG (optional)">
                <input
                  value={form.short_tag}
                  onChange={e => setForm({ ...form, short_tag: e.target.value })}
                  className="cinema-input"
                  placeholder="e.g. Open World Map"
                  style={{ fontSize: '0.85rem', padding: '10px 14px' }}
                />
              </Field>

              {/* ── Description ── */}
              <Field icon={<FileText size={14} />} label="DESCRIPTION">
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="cinema-input"
                  rows={3}
                  placeholder="Brief project description shown on the card..."
                  style={{ resize: 'none', fontSize: '0.85rem', padding: '10px 14px' }}
                />
              </Field>

              {/* Upload progress bar */}
              {saving && uploadProgress > 0 && uploadProgress < 100 && (
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, height: 6, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%', borderRadius: 8,
                      background: 'linear-gradient(90deg,var(--accent),var(--accent2))',
                      width: `${uploadProgress}%`, transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="btn-neon"
                style={{ justifyContent: 'center', borderRadius: '10px', marginTop: '0.25rem', fontSize: '0.88rem', opacity: saving ? 0.7 : 1 }}
              >
                {saving
                  ? <><Loader2 size={16} className="animate-spin" /> {uploadProgress > 0 ? `Uploading ${uploadProgress}%…` : 'Creating…'}</>
                  : <><Plus size={16} /> CREATE PROJECT</>
                }
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        fontSize: '0.63rem', fontWeight: 900, color: 'var(--muted)',
        letterSpacing: '0.15em', textTransform: 'uppercase',
      }}>
        <span style={{ color: 'var(--accent)' }}>{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
