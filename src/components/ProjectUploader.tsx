'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ProjectUploader({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    title: '',
    industry: 'Game Art',
    description: '',
    image_url: '',
    external_link: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: uploadError } = await supabase.from('projects').insert([form]);

    if (uploadError) {
      setError(uploadError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div style={overlay}>
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={modal}
      >
        <div style={header}>
          <h2 className="font-bebas" style={{ fontSize: '2.5rem', margin: 0 }}>NEW ENTRY</h2>
          <button onClick={onClose} style={closeBtn}><X /></button>
        </div>

        {success ? (
          <div style={successState}>
            <CheckCircle2 size={64} color="var(--accent)" />
            <h3 className="font-bebas" style={{ fontSize: '2rem', marginTop: '1rem' }}>UPLOAD COMPLETE</h3>
            <p>ARCHIVING TO MONOLITH DATABASE...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={inputGroup}>
              <label style={label}>PROJECT TITLE</label>
              <input 
                required 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})} 
                style={input} 
                placeholder="EX: FORTIS ARCHIVE"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={inputGroup}>
                <label style={label}>SECTOR</label>
                <select 
                  value={form.industry} 
                  onChange={e => setForm({...form, industry: e.target.value})} 
                  style={input}
                >
                  <option>Game Art</option>
                  <option>UI Design</option>
                  <option>Environments</option>
                  <option>Scripts</option>
                </select>
              </div>
              <div style={inputGroup}>
                <label style={label}>IMAGE URL</label>
                <input 
                  required 
                  value={form.image_url} 
                  onChange={e => setForm({...form, image_url: e.target.value})} 
                  style={input} 
                  placeholder="HTTPS://..."
                />
              </div>
            </div>

            <div style={inputGroup}>
              <label style={label}>NARRATIVE / DESCRIPTION</label>
              <textarea 
                required 
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})} 
                style={{ ...input, height: '120px', resize: 'none' }} 
              />
            </div>

            {error && (
              <div style={errorBox}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={submitBtn}>
              {loading ? 'ARCHIVING...' : 'COMMIT TO GRID'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 10000,
  background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
};

const modal: React.CSSProperties = {
  background: '#151515', borderLeft: '12px solid var(--accent)',
  width: '100%', maxWidth: '600px', padding: '3.5rem'
};

const header: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
  paddingBottom: '1.5rem'
};

const closeBtn: React.CSSProperties = {
  background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer'
};

const formStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '2rem' };
const inputGroup: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.75rem' };
const label: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' };
const input: React.CSSProperties = {
  width: '100%', padding: '1.25rem', background: '#000', 
  border: '1px solid rgba(255,255,255,0.05)', color: '#fff', 
  fontSize: '1rem', outline: 'none'
};

const submitBtn: React.CSSProperties = {
  width: '100%', padding: '1.5rem', background: 'var(--accent)', 
  border: 'none', color: '#000', fontWeight: 900, fontSize: '1rem', 
  letterSpacing: '0.15em', cursor: 'pointer', marginTop: '1rem'
};

const successState: React.CSSProperties = {
  textAlign: 'center', padding: '3rem 0', color: '#fff'
};

const errorBox: React.CSSProperties = {
  padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', 
  color: '#ef4444', border: '1px solid #ef4444', 
  display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem'
};
