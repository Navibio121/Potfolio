'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layout, FileText, DollarSign, Share2 } from 'lucide-react';

const REQUIREMENTS = [
  {
    title: 'Reference Board',
    desc: 'Links to Pinterest, ArtStation, or moodboards that define your aesthetic.',
    icon: <Layout size={32} />,
    color: '#34d399',
  },
  {
    title: 'Technical Specs',
    desc: 'Polycount limits, file formats (FBX/OBJ), and target engine (Roblox/UE5).',
    icon: <FileText size={32} />,
    color: '#60a5fa',
  },
  {
    title: 'Budget & Timeline',
    desc: 'Clear boundaries on your available investment and the project deadline.',
    icon: <DollarSign size={32} />,
    color: '#fbbf24',
  },
  {
    title: 'Asset Access',
    desc: 'Any existing environment files or base models I need to build upon.',
    icon: <Share2 size={32} />,
    color: '#f472b6',
  },
];

export default function OnboardingSection() {
  return (
    <section id="onboarding" style={{
      padding: '8rem 5%',
      background: 'var(--bg)',
      borderTop: '1px solid var(--card-border)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="sec-label" 
            style={{ color: 'var(--accent)', marginBottom: '1rem' }}
          >
            — Project Starter Kit
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-syncopate" 
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: 'var(--fg)', margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em'
            }}
          >
            What I Need From You
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ color: 'var(--muted)', marginTop: '1.25rem', fontSize: '1.1rem', maxWidth: '600px', marginInline: 'auto', lineHeight: 1.6 }}
          >
            To ensure the highest quality results, please have these materials ready before our first discovery call.
          </motion.p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
        }}>
          {REQUIREMENTS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, borderColor: item.color }}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '24px',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Decorative background glow */}
              <div style={{
                position: 'absolute', top: '-20%', right: '-20%',
                width: '150px', height: '150px', borderRadius: '50%',
                background: item.color, filter: 'blur(60px)',
                opacity: 0.05, pointerEvents: 'none'
              }} />

              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: `${item.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: item.color,
                border: `1px solid ${item.color}33`
              }}>
                {item.icon}
              </div>

              <div>
                <h3 className="font-syne" style={{ 
                  fontSize: '1.4rem', fontWeight: 800, color: 'var(--fg)', marginBottom: '0.75rem' 
                }}>
                  {item.title}
                </h3>
                <p style={{ 
                  color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 
                }}>
                  {item.desc}
                </p>
              </div>

              <div style={{ 
                marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', 
                color: item.color, fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' 
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color }} />
                Required Asset
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ 
            marginTop: '4rem', textAlign: 'center', padding: '2rem', 
            background: 'var(--card-bg)40', borderRadius: '20px', border: '1px dashed var(--card-border)' 
          }}
        >
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>
            Don't have everything yet? <span style={{ color: 'var(--fg)', fontWeight: 700 }}>Don't worry.</span> We can refine the brief together during our initial call.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
