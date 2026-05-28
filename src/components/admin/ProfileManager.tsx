'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Camera, Loader2, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArtistSettings {
  id: number;
  profile_image?: string;
  discord?: string;
  twitter?: string;
  instagram?: string;
  artstation?: string;
  bio?: string;
  name?: string;
  artist_title?: string;
  pronouns?: string;
  tech_stack?: any;
  payment_methods?: any;
  pricing_tiers?: any;
}

export default function ProfileManager() {
  const [settings, setSettings] = useState<ArtistSettings>({
    id: 1, profile_image: '', discord: '', twitter: '', instagram: '', artstation: '',
    bio: '', name: 'ARIA VOSS', pronouns: 'She / Her', artist_title: 'Creative Lead · 3D Artist',
    tech_stack: [], payment_methods: [], pricing_tiers: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('artist_settings').select('*').eq('id', 1).single();
    if (data) {
      setSettings(data);
      setImagePreview(data.profile_image || '');
    }
    if (error && error.code !== 'PGRST116') console.error('Fetch error:', error);
    setLoading(false);
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `profiles/${Date.now()}.${ext}`; 
      
      console.log('Uploading avatar to:', path);
      const { error } = await supabase.storage.from('images').upload(path, file, { 
        upsert: true,
        contentType: file.type
      });
      
      if (error) throw error;
      
      const { data } = supabase.storage.from('images').getPublicUrl(path);
      console.log('Avatar upload success:', data.publicUrl);
      return data.publicUrl;
    } catch (error: any) {
      console.error('Avatar upload error:', error.message);
      alert('Upload failed: ' + error.message);
      return null;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    let finalImageUrl = settings.profile_image;
    
    if (imageFile) {
      const uploadedUrl = await uploadAvatar(imageFile);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      }
    }

    const { error } = await supabase
      .from('artist_settings')
      .upsert({
        id: 1,
        profile_image: finalImageUrl,
        discord: settings.discord,
        twitter: settings.twitter,
        instagram: settings.instagram,
        artstation: settings.artstation,
        name: settings.name,
        artist_title: settings.artist_title,
        pronouns: settings.pronouns,
        bio: settings.bio,
        tech_stack: settings.tech_stack,
        payment_methods: settings.payment_methods,
        pricing_tiers: settings.pricing_tiers,
      });

    if (error) {
      alert('Error saving: ' + error.message);
    } else {
      setSaved(true);
      setImageFile(null);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const update = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>
        <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto' }} />
        <p style={{ marginTop: '1rem' }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#fff' }}>Profile Settings</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>Manage your artist profile info</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '12px 24px', borderRadius: '12px',
            background: saved ? '#1dbf73' : 'var(--accent)', color: '#080808',
            border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'all 0.3s ease',
          }}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : saved ? <><Check size={18} /> Saved!</> : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#0f0f13', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '24px', padding: '2rem', textAlign: 'center',
          }}
        >
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '160px', height: '160px', borderRadius: '50%', margin: '0 auto 1.5rem',
              background: imagePreview ? `url(${imagePreview}) center/cover` : 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.33), rgba(var(--accent-rgb), 0.13))',
              border: '3px solid rgba(var(--accent-rgb), 0.2)', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.2)')}
          >
            {!imagePreview && <Camera size={32} color="rgba(255,255,255,0.3)" />}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'rgba(0,0,0,0.6)', padding: '8px',
              fontSize: '0.7rem', fontWeight: 700, color: '#fff',
              backdropFilter: 'blur(4px)',
            }}>
              CHANGE AVATAR
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <label style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', display: 'block' }}>
            OR PASTE IMAGE URL
          </label>
          <input
            value={settings.profile_image || ''}
            onChange={e => { update('profile_image', e.target.value); setImagePreview(e.target.value); }}
            placeholder="https://..."
            style={inputStyle}
          />
        </motion.div>

        {/* Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: '#0f0f13', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '24px', padding: '2.5rem',
            display: 'flex', flexDirection: 'column', gap: '2.5rem'
          }}
        >
          {/* Basic Info */}
          <section>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '4px', height: '18px', background: 'var(--accent)', borderRadius: '2px' }} />
              Basic Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Display Name</label>
                <input
                  value={settings.name || ''}
                  onChange={e => update('name', e.target.value)}
                  placeholder="ARIA VOSS"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Artist Title</label>
                <input
                  value={settings.artist_title || ''}
                  onChange={e => update('artist_title', e.target.value)}
                  placeholder="Creative Lead · 3D Artist"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Pronouns</label>
                <input
                  value={settings.pronouns || ''}
                  onChange={e => update('pronouns', e.target.value)}
                  placeholder="She / Her"
                  style={inputStyle}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Short Bio</label>
                <textarea
                  value={settings.bio || ''}
                  onChange={e => update('bio', e.target.value)}
                  placeholder="Tell your story..."
                  style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                />
              </div>
            </div>
          </section>

          {/* Social Links */}
          <section>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '4px', height: '18px', background: 'var(--accent)', borderRadius: '2px' }} />
              Social Presence
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {[
                { label: 'Discord', field: 'discord', placeholder: 'username#0001' },
                { label: 'Twitter / X', field: 'twitter', placeholder: '@handle' },
                { label: 'Instagram', field: 'instagram', placeholder: '@handle' },
                { label: 'ArtStation', field: 'artstation', placeholder: 'https://artstation.com/...' },
              ].map(item => (
                <div key={item.field}>
                  <label style={labelStyle}>{item.label}</label>
                  <input
                    value={(settings as any)[item.field] || ''}
                    onChange={e => update(item.field, e.target.value)}
                    placeholder={item.placeholder}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px', borderRadius: '10px',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  color: '#fff', fontSize: '0.9rem', outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)',
  textTransform: 'uppercase', letterSpacing: '0.05em',
  marginBottom: '0.5rem', display: 'block',
};
