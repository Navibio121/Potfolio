'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, Edit3, Save, Star, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ProjectCardProps {
  project: any;
  index: number;
  isAdmin: boolean;
  onDelete?: () => void;
  onRefresh?: () => void;
}

export default function ProjectCard({
  project,
  index,
  isAdmin,
  onDelete,
  onRefresh,
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: project.title || '',
    industry: project.industry || '',
    description: project.description || '',
    image_url: project.image_url || '',
  });

  const [activeImage, setActiveImage] = useState(project.url || project.image_url);
  const images = [project.url || project.image_url, ...(project.angles || [])].filter(Boolean);

  // Auto-slide effect
  React.useEffect(() => {
    if (!lightbox || images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImage((current: string) => {
        const currentIndex = images.indexOf(current);
        const nextIndex = (currentIndex + 1) % images.length;
        return images[nextIndex];
      });
    }, 4000); // 4 seconds per slide

    return () => clearInterval(interval);
  }, [lightbox, images]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.isSample) return alert('Cannot delete sample — upload a real project first!');
    if (!confirm(`Delete "${project.title}"?`)) return;
    await supabase.from('portfolio_works').delete().eq('id', project.id);
    onDelete?.();
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.isSample) { setEditing(false); return; }
    setSaving(true);
    await supabase.from('portfolio_works').update({
      title: form.title,
      skill_lane: form.industry,
      description: form.description,
      url: form.image_url,
    }).eq('id', project.id);
    setSaving(false);
    setEditing(false);
    onRefresh?.();
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 + index * 0.08, ease: "easeOut" }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={(e) => { 
          if (!editing) {
            e.preventDefault();
            console.log('Opening lightbox for', project.title);
            setLightbox(true);
          }
        }}
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${hovered ? 'rgba(var(--accent-rgb), 0.25)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: '12px', overflow: 'hidden',
          cursor: editing ? 'default' : 'pointer',
          transition: 'border-color 0.25s, box-shadow 0.25s',
          boxShadow: hovered && !editing ? '0 8px 28px rgba(var(--accent-rgb), 0.15)' : 'none',
          position: 'relative',
          zIndex: hovered ? 10 : 1,
        }}
      >
        {/* ── Thumbnail ── */}
        {!editing && (
          <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#111' }}>
            <img
              src={activeImage} alt={project.title}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.4s ease',
              }}
            />

            {/* Gallery Overlay Count */}
            {images.length > 1 && (
              <div style={{
                position: 'absolute', bottom: '12px', right: '12px',
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                padding: '4px 10px', borderRadius: '6px', color: '#fff',
                fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <ImageIcon size={12} /> {images.length}
              </div>
            )}

            {/* Admin overlay buttons */}
            {isAdmin && !project.isSample && (
              <div
                style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px', zIndex: 10 }}
                onClick={e => e.stopPropagation()}
              >
                <button onClick={() => setEditing(true)} title="Edit" style={iconBtn('#0ea5e9')}><Edit3 size={13} /></button>
                <button onClick={handleDelete} title="Delete" style={iconBtn('#ef4444')}><Trash2 size={13} /></button>
              </div>
            )}
          </div>
        )}

        {/* ── Inline Edit Form ── */}
        {editing && (
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} onClick={e => e.stopPropagation()}>
            <p style={lbl}>HEADLINE / TITLE</p>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="cinema-input" placeholder="Project title" />

            <p style={lbl}>CATEGORY</p>
            <select value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} className="cinema-input">
              {['Game Art', 'UI Design', 'Environments', 'Scripts'].map(c => <option key={c}>{c}</option>)}
            </select>

            <p style={lbl}>IMAGE URL</p>
            <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="cinema-input" placeholder="https://..." />

            <p style={lbl}>DESCRIPTION</p>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="cinema-input" style={{ height: '80px', resize: 'none' }} placeholder="Short description of the project" />

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
              <button onClick={handleSave} className="btn-neon" style={{ flex: 1, justifyContent: 'center', borderRadius: '8px', padding: '10px', fontSize: '0.82rem' }}>
                {saving ? 'Saving…' : <><Save size={14} /> SAVE</>}
              </button>
              <button onClick={e => { e.stopPropagation(); setEditing(false); }} className="btn-outline" style={{ flex: 1, justifyContent: 'center', borderRadius: '8px', padding: '10px', fontSize: '0.82rem' }}>
                <X size={14} /> CANCEL
              </button>
            </div>
          </div>
        )}

        {/* ── Card body (Fiverr style) ── */}
        {!editing && (
          <div style={{ padding: '1rem 1.1rem 1.25rem' }}>
            <div style={{
              display: 'inline-block', padding: '4px 10px', borderRadius: '50px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--accent)', fontSize: '0.65rem', fontWeight: 800,
              letterSpacing: '0.05em', marginBottom: '0.75rem', textTransform: 'uppercase'
            }}>
              {project.industry}
            </div>

            <h3 style={{
              margin: '0 0 0.45rem', fontSize: '1rem', fontWeight: 700, color: 'var(--fg)',
              lineHeight: 1.35,
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {project.title}
            </h3>

            {project.description && (
              <p style={{
                margin: '0 0 0.75rem', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.55,
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                "{project.description}"
              </p>
            )}

            {/* Star rating row */}
            {/* Gallery Thumbnails (only if multiple images) */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '1rem', overflowX: 'auto', paddingBottom: '4px' }}>
                {images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setActiveImage(img); }}
                    style={{
                      width: '50px', height: '50px', borderRadius: '6px', overflow: 'hidden',
                      border: `2px solid ${activeImage === img ? 'var(--accent)' : 'rgba(var(--accent-rgb), 0.1)'}`,
                      cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s'
                    }}
                  >
                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 10000,
              background: 'rgba(7,7,15,0.96)', backdropFilter: 'blur(14px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
            }}
          >
            <button onClick={() => setLightbox(false)}
              style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={22} />
            </button>

            <div style={{ maxWidth: '860px', width: '100%' }} onClick={e => e.stopPropagation()}>
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', borderLeft: '4px solid var(--accent)', boxShadow: '0 30px 70px rgba(0,0,0,0.7)' }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={activeImage}
                    alt={project.title}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%', display: 'block' }}
                  />
                </AnimatePresence>
              </div>

              {/* Lightbox Gallery Thumbnails */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem', justifyContent: 'center' }}>
                  {images.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      style={{
                        width: '70px', height: '70px', borderRadius: '10px', overflow: 'hidden',
              border: `2px solid ${activeImage === img ? 'var(--accent)' : 'rgba(var(--accent-rgb), 0.1)'}`,
                        cursor: 'pointer', opacity: activeImage === img ? 1 : 0.5, transition: 'all 0.2s'
                      }}
                    >
                      <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: '2rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{project.industry}</span>
                <h2 className="font-bebas" style={{ fontSize: 'clamp(2rem,5vw,4rem)', color: '#fff', lineHeight: 1, margin: '0.5rem 0 1rem' }}>{project.title}</h2>
                {project.description && <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '640px' }}>{project.description}</p>}

                {isAdmin && !project.isSample && (
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button onClick={() => { setLightbox(false); setEditing(true); }} className="btn-outline" style={{ borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
                      <Edit3 size={15} /> EDIT
                    </button>
                    <button onClick={handleDelete} style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Trash2 size={15} /> DELETE
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}

const iconBtn = (color: string): React.CSSProperties => ({
  background: `${color}22`, border: `1px solid ${color}`, color,
  borderRadius: '6px', width: '30px', height: '30px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
});

const lbl: React.CSSProperties = {
  margin: 0, fontSize: '0.65rem', fontWeight: 900,
  color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase',
};
