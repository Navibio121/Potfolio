'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, X, ExternalLink, Link2 } from 'lucide-react';

/* ── All supported platforms ────────────────────────── */
const PLATFORMS = [
  { id: 'discord',   label: 'Discord',    icon: '🎮', placeholder: 'username or invite link', hint: 'e.g. artist#1234 or discord.gg/server' },
  { id: 'twitter',   label: 'X / Twitter', icon: '𝕏',  placeholder: '@username',                hint: 'e.g. @ariavoss' },
  { id: 'instagram', label: 'Instagram',  icon: '📸', placeholder: '@username',                 hint: 'e.g. @ariavoss' },
  { id: 'tiktok',    label: 'TikTok',     icon: '🎵', placeholder: '@username',                 hint: 'e.g. @ariavoss' },
  { id: 'youtube',   label: 'YouTube',    icon: '▶️', placeholder: 'Channel URL or @handle',    hint: 'e.g. youtube.com/@artist' },
  { id: 'twitch',    label: 'Twitch',     icon: '🟣', placeholder: 'Channel name',              hint: 'e.g. twitch.tv/artist' },
  { id: 'behance',   label: 'Behance',    icon: '🅱',  placeholder: 'Profile URL',               hint: 'e.g. behance.net/artist' },
  { id: 'artstation',label: 'ArtStation', icon: '🎨', placeholder: 'Profile URL',               hint: 'e.g. artstation.com/artist' },
  { id: 'deviantart',label: 'DeviantArt', icon: '🖌️', placeholder: 'Profile URL',               hint: 'e.g. deviantart.com/artist' },
  { id: 'portfolio', label: 'Website',    icon: '🌐', placeholder: 'https://yoursite.com',       hint: 'Your personal website' },
  { id: 'linkedin',  label: 'LinkedIn',   icon: '💼', placeholder: 'Profile URL',               hint: 'e.g. linkedin.com/in/artist' },
  { id: 'telegram',  label: 'Telegram',   icon: '✈️', placeholder: '@username or t.me/link',    hint: 'e.g. @ariavoss' },
];

interface SocialLink {
  platformId: string;
  value: string;
}

interface SocialLinksSectionProps {
  /** View-only mode: pass in the artist's filled links */
  links?: SocialLink[];
  /** If true, shows the editor UI */
  editable?: boolean;
}

export default function SocialLinksSection({
  links: initialLinks = [
    { platformId: 'discord',   value: 'ariavoss#0001' },
    { platformId: 'twitter',   value: '@ariavoss' },
    { platformId: 'instagram', value: '@aria.voss.art' },
  ],
  isAdmin = false,
  editable = false,
}: SocialLinksSectionProps & { isAdmin?: boolean }) {
  /* Which platforms the artist has toggled ON */
  const [enabled, setEnabled] = useState<Set<string>>(
    new Set(initialLinks.map(l => l.platformId))
  );
  /* The actual values */
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(initialLinks.map(l => [l.platformId, l.value]))
  );
  const [editMode, setEditMode] = useState(editable);

  const togglePlatform = (id: string) => {
    setEnabled(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const setValue = (id: string, val: string) => {
    setValues(prev => ({ ...prev, [id]: val }));
  };

  /* Platforms shown in view mode (enabled + has value) */
  const visibleLinks = PLATFORMS.filter(p =>
    enabled.has(p.id) && (editMode || values[p.id])
  );

  return (
    <section style={{
      padding: '5rem 5%',
      background: 'var(--sec-social)',
      borderTop: '1px solid var(--card-border)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-inter)', fontSize: '0.78rem',
              fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--muted)', margin: '0 0 0.6rem',
            }}>— Find Me Online</p>
            <h2 className="font-syne" style={{
              margin: 0, fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 800, color: 'var(--fg)', letterSpacing: '-0.02em',
            }}>
              Social & Media Links
            </h2>
          </div>

          {/* Toggle edit mode button */}
          <button
            onClick={() => {
              if (!isAdmin) {
                alert('Admin Mode Required.');
                return;
              }
              setEditMode(v => !v);
            }}
            style={{
              padding: '10px 20px', borderRadius: '999px',
              background: editMode ? 'var(--fg)' : 'var(--card-bg)',
              color: editMode ? 'var(--bg)' : (isAdmin ? 'var(--fg)' : 'var(--muted)'),
              border: isAdmin ? '1px solid var(--card-border)' : '1px dashed var(--card-border)',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              fontFamily: 'var(--font-inter)',
              display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.25s ease',
              opacity: isAdmin ? 1 : 0.7
            }}
          >
            {editMode ? <><Check size={15} /> Done Editing</> : <><Plus size={15} /> Edit Links</>}
            {!isAdmin && <span style={{ fontSize: '0.65rem', background: 'var(--accent)22', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px' }}>LOCKED</span>}
          </button>
        </div>

        {/* ── Edit Mode: Platform picker ── */}
        <AnimatePresence>
          {editMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginBottom: '2rem' }}
            >
              <p style={{
                color: 'var(--muted)', fontSize: '0.82rem',
                fontFamily: 'var(--font-inter)', marginBottom: '1rem',
              }}>
                Select the platforms you use, then fill in your username or link below.
              </p>
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '8px',
              }}>
                {PLATFORMS.map(p => {
                  const on = enabled.has(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      style={{
                        padding: '7px 16px', borderRadius: '999px',
                        background: on ? 'var(--fg)' : 'transparent',
                        color: on ? 'var(--bg)' : 'var(--muted)',
                        border: `1px solid ${on ? 'var(--fg)' : 'var(--card-border)'}`,
                        cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                        fontFamily: 'var(--font-inter)',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span>{p.icon}</span> {p.label}
                      {on && <X size={12} />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Input fields (edit mode, for enabled platforms) ── */}
        <AnimatePresence>
          {editMode && enabled.size > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1rem',
                marginBottom: '2.5rem',
                padding: '1.5rem',
                borderRadius: '20px',
                background: 'var(--bg)',
                border: '1px solid var(--card-border)',
              }}
            >
              {PLATFORMS.filter(p => enabled.has(p.id)).map(p => (
                <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontSize: '0.82rem', fontWeight: 700,
                    fontFamily: 'var(--font-inter)', color: 'var(--fg)',
                  }}>
                    <span style={{ fontSize: '1rem' }}>{p.icon}</span>
                    {p.label}
                    <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder={p.placeholder}
                    value={values[p.id] ?? ''}
                    onChange={e => setValue(p.id, e.target.value)}
                    style={{
                      padding: '10px 14px', borderRadius: '10px',
                      background: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                      color: 'var(--fg)', fontSize: '0.88rem',
                      outline: 'none', width: '100%',
                      fontFamily: 'var(--font-inter)',
                      boxSizing: 'border-box',
                    }}
                  />
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.72rem', fontFamily: 'var(--font-inter)' }}>
                    {p.hint}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── View Mode: Social link cards ── */}
        {visibleLinks.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {visibleLinks.map((p, i) => {
              const val = values[p.id];
              const isUrl = val?.startsWith('http');
              return (
                <motion.a
                  key={p.id}
                  href={isUrl ? val : undefined}
                  target={isUrl ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '1rem 1.25rem', borderRadius: '14px',
                    background: 'var(--bg)',
                    border: '1px solid var(--card-border)',
                    textDecoration: 'none', color: 'var(--fg)',
                    transition: 'all 0.2s ease',
                    cursor: val ? 'pointer' : 'default',
                  }}
                  onMouseOver={e => {
                    if (val) {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--fg)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseOut={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)';
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                  }}
                >
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{p.icon}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{
                      margin: 0, fontSize: '0.72rem', fontWeight: 700,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: 'var(--muted)', fontFamily: 'var(--font-inter)',
                    }}>
                      {p.label}
                    </p>
                    <p className="font-syne" style={{
                      margin: '3px 0 0', fontSize: '0.88rem', fontWeight: 600,
                      color: 'var(--fg)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {val || <span style={{ color: 'var(--muted)', fontWeight: 400 }}>Not set</span>}
                    </p>
                  </div>
                  {val && <ExternalLink size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />}
                </motion.a>
              );
            })}
          </div>
        ) : (
          <div style={{
            textAlign: 'center', padding: '3rem',
            borderRadius: '16px', border: '1px dashed var(--card-border)',
            color: 'var(--muted)',
          }}>
            <Link2 size={32} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.4 }} />
            <p className="font-syne" style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
              No social links added yet
            </p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', fontFamily: 'var(--font-inter)' }}>
              Click &ldquo;Edit Links&rdquo; to add your profiles
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
