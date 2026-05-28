'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Play, Maximize2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

/* ─── Types ─────────────────────────────────────────── */
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Pro' | 'Expert';

export interface SkillWork {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumb?: string;
  title: string;
  description?: string;
  likes: number;
  angles?: string[];
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  description: string;
  level: SkillLevel;
  color: string;
  works: SkillWork[];
}

/* ─── Level badge config ─────────────────────────────── */
const LEVEL_CONFIG: Record<SkillLevel, { label: string; bg: string; color: string }> = {
  Beginner:     { label: 'Beginner',     bg: 'rgba(100,116,139,0.18)', color: '#94a3b8' },
  Intermediate: { label: 'Intermediate', bg: 'rgba(59,130,246,0.18)',  color: '#60a5fa' },
  Pro:          { label: 'Pro',          bg: 'rgba(139,92,246,0.22)',  color: 'var(--accent)' },
  Expert:       { label: '⭐ Expert',    bg: 'rgba(251,191,36,0.18)',  color: '#fbbf24' },
};

/* ─── Lightbox ───────────────────────────────────────── */
function Lightbox({ work, onClose }: { work: SkillWork; onClose: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const mediaList = [work.url, ...(work.angles || [])];
  
  React.useEffect(() => {
    if (mediaList.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % mediaList.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [mediaList.length, isPaused]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.94)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%', width: '44px', height: '44px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#fff',
        }}
      >
        <X size={20} />
      </button>

      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={e => e.stopPropagation()}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{ maxWidth: '90vw', maxHeight: '85vh', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        {work.type === 'video' && activeIndex === 0 ? (
          <video
            src={work.url}
            controls autoPlay
            style={{ maxWidth: '100%', maxHeight: '76vh', borderRadius: '12px' }}
          />
        ) : (
          <img
            src={mediaList[activeIndex]}
            alt={work.title}
            style={{ maxWidth: '100%', maxHeight: '76vh', objectFit: 'contain', borderRadius: '12px' }}
          />
        )}
        
        {/* Thumbnails for angles */}
        {mediaList.length > 1 && (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', justifyContent: 'center' }}>
             {mediaList.map((url, i) => (
                <img 
                  key={i} 
                  src={work.type === 'video' && i === 0 ? (work.thumb || url) : url} 
                  onClick={() => setActiveIndex(i)}
                  style={{ 
                    width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer',
                    border: activeIndex === i ? '2px solid var(--accent)' : '2px solid transparent',
                    opacity: activeIndex === i ? 1 : 0.6
                  }} 
                />
             ))}
          </div>
        )}

        <div>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-syne)' }}>
            {work.title}
          </h3>
          {work.description && (
            <p style={{ margin: '0.4rem 0 0', color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', fontFamily: 'var(--font-inter)' }}>
              {work.description}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Individual work card (landscape) ──────────────── */
function WorkCard({ work, accentColor }: { work: SkillWork; accentColor: string }) {
  const [likes, setLikes] = useState(work.likes);
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) return; // Prevent spamming / undoing for now, simple implementation
    
    setLiked(true);
    setLikes(v => v + 1);

    // Dynamic Supabase update
    if (work.id.length > 20) { // check if it's a UUID from Supabase (not hardcoded MOCK)
      const { error } = await supabase
        .from('portfolio_works')
        .update({ likes: likes + 1 })
        .eq('id', work.id);
      
      if (error) {
        console.error('Failed to update likes:', error);
        // revert
        setLiked(false);
        setLikes(v => v - 1);
      }
    }
  };

  return (
    <>
      {lightbox && <Lightbox work={work} onClose={() => setLightbox(false)} />}

      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={() => setLightbox(true)}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25 }}
        style={{
          flexShrink: 0,
          width: '240px',
          height: '300px',
          borderRadius: '16px',
          overflow: 'hidden',
          cursor: 'pointer',
          position: 'relative',
          background: 'var(--card-bg)',
          border: `1px solid ${hovered ? accentColor + '44' : 'var(--card-border)'}`,
          boxShadow: hovered ? `0 12px 40px ${accentColor}22` : '0 2px 12px rgba(0,0,0,0.3)',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          scrollSnapAlign: 'start',
        }}
      >
        {/* Media */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {work.type === 'image' ? (
            <img
              src={work.url}
              alt={work.title}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.5s ease',
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
              }}
            />
          ) : (
            <>
              {work.thumb ? (
                <img src={work.thumb} alt={work.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  background: `linear-gradient(135deg, ${accentColor}22, #0a0a1a)`,
                }} />
              )}
              {/* Video play badge */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '52px', height: '52px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.55)',
                border: `2px solid ${accentColor}88`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(6px)',
              }}>
                <Play size={20} color={accentColor} style={{ marginLeft: '3px' }} />
              </div>
              {/* Video label */}
              <span style={{
                position: 'absolute', top: '10px', left: '10px',
                padding: '3px 10px', borderRadius: '999px',
                background: `${accentColor}22`,
                border: `1px solid ${accentColor}44`,
                color: accentColor, fontSize: '0.68rem', fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                VIDEO
              </span>
            </>
          )}
        </div>

        {/* Bottom overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '1rem',
          opacity: hovered ? 1 : 0.75,
          transition: 'opacity 0.3s ease',
        }}>
          <h4 style={{
            margin: 0, color: '#fff',
            fontSize: '0.92rem', fontWeight: 700,
            fontFamily: 'var(--font-syne)',
            transform: hovered ? 'translateY(0)' : 'translateY(4px)',
            transition: 'transform 0.3s ease',
          }}>
            {work.title}
          </h4>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: '0.5rem',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(6px)',
            transition: 'all 0.3s ease 0.04s',
          }}>
            <button
              onClick={handleLike}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '5px 12px', borderRadius: '999px',
                background: liked ? '#ef444422' : 'rgba(255,255,255,0.12)',
                border: `1px solid ${liked ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
                color: liked ? '#ef4444' : '#fff',
                cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                backdropFilter: 'blur(6px)',
                transition: 'all 0.2s ease',
              }}
            >
              <Heart size={13} fill={liked ? '#ef4444' : 'none'} />
              {likes}
            </button>
            <button
              onClick={e => { e.stopPropagation(); setLightbox(true); }}
              style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(6px)',
              }}
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ─── Single skill lane ──────────────────────────────── */
function SkillLane({ skill, index }: { skill: Skill; index: number }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const levelCfg = LEVEL_CONFIG[skill.level];

  const scroll = (dir: 'left' | 'right') => {
    if (!stripRef.current) return;
    stripRef.current.scrollBy({ left: dir === 'right' ? 520 : -520, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      style={{
        padding: '3rem 0 3.5rem',
        borderBottom: '1px solid var(--card-border)',
        position: 'relative',
      }}
    >
      {/* Accent left border */}
      <div style={{
        position: 'absolute', left: 0, top: '2rem', bottom: '2rem',
        width: '3px', borderRadius: '999px',
        background: `linear-gradient(to bottom, ${skill.color}, transparent)`,
      }} />

      {/* Lane header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', flexWrap: 'wrap',
        gap: '1rem', marginBottom: '0.75rem',
        paddingLeft: '1.5rem',
      }}>
        {/* Left: Icon + name + badge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{skill.icon}</span>
            <h3 className="font-bebas" style={{
              margin: 0,
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              color: 'var(--fg)', letterSpacing: '0.03em',
              lineHeight: 1,
            }}>
              {skill.name}
            </h3>
            {/* Level badge */}
            <span style={{
              padding: '4px 14px', borderRadius: '999px',
              background: levelCfg.bg, color: levelCfg.color,
              fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              border: `1px solid ${levelCfg.color}33`,
              alignSelf: 'center',
            }}>
              {levelCfg.label}
            </span>
          </div>
          <p style={{
            margin: 0, color: 'var(--muted)',
            fontSize: '0.9rem', fontFamily: 'var(--font-inter)',
            fontWeight: 300, maxWidth: '500px', lineHeight: 1.6,
            paddingLeft: '0.2rem',
          }}>
            {skill.description}
          </p>
        </div>

        {/* Right: Work count + scroll arrows */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <span style={{
            color: skill.color, fontSize: '0.82rem', fontWeight: 700,
            letterSpacing: '0.06em',
          }}>
            {skill.works.length} works
          </span>
          <button onClick={() => scroll('left')} style={arrowBtnStyle}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scroll('right')} style={arrowBtnStyle}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal scroll strip */}
      <div
        ref={stripRef}
        style={{
          display: 'flex', gap: '1rem',
          overflowX: 'auto', overflowY: 'visible',
          scrollSnapType: 'x mandatory',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          paddingBottom: '0.75rem',
          paddingTop: '0.5rem',
          scrollbarWidth: 'none',
        }}
        /* Hide scrollbar on webkit */
        className="hide-scrollbar"
      >
        {skill.works.map(work => (
          <WorkCard key={work.id} work={work} accentColor={skill.color} />
        ))}

        {/* "View All" trailing card */}
        <div style={{
          flexShrink: 0, width: '160px', height: '300px',
          borderRadius: '16px',
          border: `1px dashed ${skill.color}44`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '0.5rem', cursor: 'pointer',
          color: skill.color,
          scrollSnapAlign: 'start',
          transition: 'background 0.2s ease',
        }}
          onMouseOver={e => (e.currentTarget.style.background = `${skill.color}0a`)}
          onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
        >
          <span style={{ fontSize: '1.5rem' }}>→</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textAlign: 'center' }}>
            View All<br />{skill.works.length} Works
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Section ───────────────────────────────────── */
interface SkillShowcaseProps {
  skills: Skill[];
}

export default function SkillShowcase({ skills }: SkillShowcaseProps) {
  return (
    <section
      id="skill-showcase"
      className="bg-option-3"
      style={{
        borderTop: '1px solid var(--card-border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >

      {/* Section header */}
      <div style={{
        padding: '5.5rem 5% 0',
        maxWidth: '1400px', margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}
        >
          <div>
            <p className="sec-label" style={{ margin: '0 0 0.6rem' }}>— Skills & Works</p>
            <h2 className="font-bebas" style={{
              margin: 0,
              fontSize: 'clamp(3rem, 7vw, 6rem)',
              color: 'var(--fg)', letterSpacing: '0.02em',
              lineHeight: 0.92,
            }}>
              THE PORTFOLIO
            </h2>
          </div>
          <p style={{
            color: 'var(--muted)', fontSize: '0.95rem', fontWeight: 300,
            maxWidth: '380px', lineHeight: 1.7, margin: 0,
          }}>
            Scroll down to explore every discipline — each lane is a dedicated showcase for a specific skill set.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'flex', gap: '2.5rem', flexWrap: 'wrap',
            padding: '1.5rem 0',
            borderBottom: '1px solid var(--card-border)',
            marginBottom: '0',
          }}
        >
          {[
            { label: 'Skill Lanes', value: skills.length },
            { label: 'Total Works', value: skills.reduce((a, s) => a + s.works.length, 0) },
            { label: 'Expert Skills', value: skills.filter(s => s.level === 'Expert').length },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-bebas" style={{ margin: 0, fontSize: '2.2rem', color: 'var(--fg)', lineHeight: 1 }}>
                {value}
              </p>
              <p className="sec-label" style={{ margin: '3px 0 0' }}>{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Skill lanes */}
      <div style={{ padding: '0 5%', maxWidth: '1400px', margin: '0 auto' }}>
        {skills.map((skill, i) => (
          <SkillLane key={skill.id} skill={skill} index={i} />
        ))}
      </div>

      {/* Bottom padding */}
      <div style={{ height: '4rem' }} />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

const arrowBtnStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '36px', height: '36px', borderRadius: '50%',
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  color: 'var(--fg)', cursor: 'pointer',
  transition: 'all 0.2s ease',
};
