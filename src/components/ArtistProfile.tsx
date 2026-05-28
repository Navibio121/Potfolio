'use client';

import React, { useState, useEffect } from 'react';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { Save, Edit3, Heart, Layers } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Reusable Count-Up Counter Component
function Counter({ value, duration = 1.5 }: { value: number | string; duration?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const numericVal = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, '')) || 0;
  const isNumeric = !isNaN(numericVal);
  const suffix = typeof value === 'string' ? String(value).replace(/[0-9]/g, '') : '';

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });

  const inView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (inView && isNumeric) {
      animate(motionValue, numericVal, { duration, ease: 'easeOut' });
    }
  }, [inView, motionValue, numericVal, isNumeric, duration]);

  React.useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString() + suffix;
      }
    });
  }, [springValue, suffix]);

  if (!isNumeric) return <span>{value}</span>;
  return <span ref={ref}>0{suffix}</span>;
}

export default function ArtistProfile({
  name: initialName = 'ARIA VOSS',
  bio: initialBio = 'Digital alchemist turning raw pixels into emotional landscapes. Specializing in surreal CGI, atmospheric concept art, and motion design that lives between dreams and data.',
  totalLikes = 1842,
  totalWorks = 0,
  isAdmin = false,
}: any) {
  const [profile, setProfile] = useState({ name: initialName, title: 'Creative Lead · 3D Artist', bio: initialBio, avatar: '' });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('artist_settings').select('*').eq('id', 1).single().then(({ data }) => {
      if (data) setProfile(p => ({
        ...p,
        name: data.name || initialName,
        title: data.artist_title || data.title || p.title,
        bio: data.bio || initialBio,
        avatar: data.profile_image || '',
      }));
    });
  }, [initialName, initialBio]);

  const save = async () => {
    setSaving(true);
    await supabase.from('artist_settings').update({
      name: profile.name, 
      artist_title: profile.title,
      bio: profile.bio, 
      profile_image: profile.avatar,
    }).eq('id', 1);
    setSaving(false);
    setEditing(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    try {
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `profiles/${Date.now()}.${ext}`;
      
      const { error } = await supabase.storage.from('images').upload(path, file, { upsert: true });
      if (error) throw error;

      const { data } = supabase.storage.from('images').getPublicUrl(path);
      setProfile(prev => ({ ...prev, avatar: data.publicUrl }));
    } catch (err: any) {
      console.error('Avatar upload failed:', err.message);
      alert('Upload failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
      style={{ padding: '7rem 5%', background: 'var(--bg)' }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: '4rem', alignItems: 'center' }}>

          {/* ── Identity Card ── */}
          <div style={{ background:'var(--gradient-card)', border:'1px solid var(--glass-border)', borderRadius:'24px', overflow:'hidden', position:'relative' }}>
            {/* Gradient header strip */}
            <div style={{ height:'120px', background:'linear-gradient(135deg,var(--accent),var(--accent2))', position:'relative' }}>
              <div style={{ position:'absolute', inset:0, background:'rgba(7,7,15,0.3)' }} />
            </div>

            <div style={{ padding:'0 2rem 2.5rem', marginTop:'-80px', textAlign:'center' }}>
              {/* Portrait with Overlay */}
              <motion.div
                whileHover="hover"
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '24px',
                  margin: '0 auto 1.5rem',
                  border: '3px solid var(--accent)',
                  overflow: 'hidden',
                  background: '#080808',
                  boxShadow: '0 0 35px rgba(var(--accent-rgb), 0.25)',
                  position: 'relative',
                  cursor: 'pointer',
                  zIndex: 2
                }}
              >
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.1), rgba(245,215,142,0.2))' }}>🎨</div>
                )}

                {/* Team member name overlay (slides up) */}
                <motion.div
                  variants={{
                    hover: { opacity: 1 }
                  }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(10,13,9,0.95) 0%, rgba(10,13,9,0.4) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '16px',
                    zIndex: 2,
                    pointerEvents: 'none',
                    textAlign: 'left'
                  }}
                >
                  <motion.p
                    variants={{
                      hover: { y: 0, opacity: 1 }
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="font-bebas"
                    style={{ margin: 0, color: '#fff', fontSize: '1.4rem', letterSpacing: '0.05em', lineHeight: 1 }}
                  >
                    {profile.name}
                  </motion.p>
                  <motion.p
                    variants={{
                      hover: { y: 0, opacity: 1 }
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.05, ease: 'easeOut' }}
                    style={{ margin: '4px 0 0', color: 'var(--accent)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.05em' }}
                  >
                    CREATIVE LEAD
                  </motion.p>
                </motion.div>
              </motion.div>

              {editing ? (
                <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'1.5rem' }}>
                  <input value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} className="cinema-input" placeholder="Name" />
                  <input value={profile.title} onChange={e=>setProfile({...profile,title:e.target.value})} className="cinema-input" placeholder="Title" />
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="file" 
                      id="avatar-file" 
                      style={{ display: 'none' }} 
                      onChange={handleAvatarUpload} 
                      accept="image/*" 
                    />
                    <button 
                      type="button"
                      onClick={() => document.getElementById('avatar-file')?.click()}
                      className="btn-outline"
                      style={{ width: '100%', fontSize: '0.75rem', padding: '10px' }}
                    >
                      {saving ? 'Uploading...' : 'Upload New Avatar'}
                    </button>
                  </div>
                  <input value={profile.avatar} onChange={e=>setProfile({...profile,avatar:e.target.value})} className="cinema-input" placeholder="Or paste Avatar URL" />
                </div>
              ) : (
                <>
                  <h2 className="font-bebas" style={{ fontSize:'2.2rem', color:'#fff', margin:'0 0 0.3rem' }}>{profile.name}</h2>
                  <p style={{ color:'var(--accent)', fontSize:'0.78rem', fontWeight:800, letterSpacing:'0.12em', marginBottom:'0.5rem' }}>{profile.title}</p>
                </>
              )}

              {/* Stats Cards with Counter */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                {[{ icon:<Heart size={16}/>, val:totalLikes, label:'LIKES' }, { icon:<Layers size={16}/>, val:totalWorks||'12', label:'PROJECTS' }].map(s=>(
                  <div key={s.label} style={{ background:'rgba(255,255,255,0.04)', borderRadius:'12px', padding:'1rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', border:'1px solid var(--card-border)' }}>
                    <span style={{ color:'var(--accent)' }}>{s.icon}</span>
                    <span style={{ fontWeight:900, fontSize:'1.3rem', color:'#fff' }}>
                      <Counter value={s.val} />
                    </span>
                    <span style={{ fontSize:'0.65rem', color:'var(--muted)', fontWeight:800, letterSpacing:'0.1em' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bio Column ── */}
          <div>
            <p className="sec-label">THE ARTIST</p>
            <h2 className="font-bebas" style={{ fontSize:'clamp(2.5rem,5vw,4rem)', lineHeight:1, color:'#fff', marginBottom:'1.5rem' }}>
              TRANSFORMING <br /><span className="gradient-text">VISION</span> INTO REALITY.
            </h2>

            {editing
              ? <textarea value={profile.bio} onChange={e=>setProfile({...profile,bio:e.target.value})} className="cinema-input" style={{ height:'140px', resize:'none', marginBottom:'2rem' }} />
              : <p style={{ color:'var(--muted)', fontSize:'1.1rem', lineHeight:1.8, marginBottom:'2.5rem' }}>{profile.bio}</p>
            }

            <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', alignItems: 'center' }}>
              <a href="#contact" className="btn-pill-dot">
                <span>WORK WITH ME</span>
                <span className="dot-circle" />
              </a>
              {isAdmin && (
                <button
                  onClick={() => editing ? save() : setEditing(true)}
                  className="btn-outline"
                  style={{ display:'flex', alignItems:'center', gap:'8px', height: '48px', padding: '10px 24px', borderRadius: '50px' }}
                >
                  {saving ? 'Saving…' : editing ? <Save size={16}/> : <Edit3 size={16}/>}
                  <span>{editing ? 'SAVE' : 'EDIT'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
