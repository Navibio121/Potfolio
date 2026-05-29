'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import ProjectCard from './ProjectCard';
import AddProjectCard from './AddProjectCard';

const CATEGORIES = ['All', 'Game Art', 'UI Design', 'Environments', 'Scripts'];

/* ── 2 built-in sample cards ── */
const SAMPLE_PROJECTS = [
  {
    id: 'sample-1',
    title: 'Ingame Architecture',
    industry: 'Environments',
    description: 'It was great, the border is awesome, and it\'s going to help us a ton in our endeavors for the game!',
    image_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1600&auto=format&fit=crop',
    angles: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop'
    ],
    isSample: true,
  },
  {
    id: 'sample-2',
    title: 'Ingame Architecture',
    industry: 'Game Art',
    description: 'Yea he got the models done and they look super nice, I\'m definitely excited to see the rest of the map he\'s making!',
    image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
    angles: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop'
    ],
    isSample: true,
  },
];

export default function PortfolioRedesign({
  initialProjects = [],
  isAdmin = false,
  onRefresh,
}: {
  initialProjects?: any[];
  isAdmin?: boolean;
  onRefresh?: () => void;
}) {
  const [dbProjects, setDbProjects] = useState<any[]>(initialProjects);
  const [filter, setFilter] = useState('All');

  useEffect(() => { 
    setDbProjects(initialProjects);
  }, [initialProjects]);

  const fetchProjects = async () => {
    if (onRefresh) {
      onRefresh();
      return;
    }

    const { data } = await supabase
      .from('portfolio_works')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      const formatted = data.map(work => ({
        ...work,
        industry: work.skill_lane || work.industry || 'Game Art',
        image_url: work.url || work.image_url,
      }));
      setDbProjects(formatted);
    }
  };

  /* Merge: real DB projects first, then samples to fill visual */
  const allProjects = dbProjects.length > 0 ? dbProjects : SAMPLE_PROJECTS;

  const filtered =
    filter === 'All'
      ? allProjects
      : allProjects.filter(p => p.industry === filter);

  return (
    <section id="portfolio" style={{ padding: '5rem 5% 7rem', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <h2 className="font-syne" style={{
          fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800,
          color: 'var(--fg)', margin: '0 0 2rem',
        }}>
          Portfolio
        </h2>

        {/* ── Category Pill Filters ── */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '6px 16px', borderRadius: '50px',
                background: filter === cat
                  ? 'linear-gradient(135deg,var(--accent),var(--accent2))'
                  : 'rgba(255,255,255,0.05)',
                border: `1px solid ${filter === cat ? 'transparent' : 'rgba(255,255,255,0.12)'}`,
                color: filter === cat ? '#fff' : 'rgba(255,255,255,0.55)',
                fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s ease', whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Count ── */}
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.75rem' }}>
          Showing {filtered.length} project{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* ── Grid ── */}
        <div id="portfolio-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '1.5rem',
        }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                isAdmin={isAdmin}
                onDelete={fetchProjects}
                onRefresh={fetchProjects}
              />
            ))}

            {/* ── "Add New Project" card — always last, admin only ── */}
            {isAdmin && (
              <AddProjectCard key="add-new" onSaved={fetchProjects} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
