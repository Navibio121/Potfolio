'use client';

import React from 'react';

const STACK = [
  'Blender 3D', 'Unreal Engine 5', 'React', 'Node.js',
  'Substance Painter', 'ZBrush', 'Lua', 'Figma',
  'After Effects', 'Cinema 4D', 'TypeScript', 'TailwindCSS',
];

// Duplicate for infinite scroll
const MARQUEE_ITEMS = [...STACK, ...STACK];

export default function TechStackMarquee() {
  return (
    <div className="marquee-container" style={{
      background: 'var(--sec-profile)',
      padding: '2rem 0',
      borderBottom: '1px solid var(--card-border)',
      position: 'relative',
    }}>
      {/* Edge gradients for smooth fade out */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: '150px',
        background: 'linear-gradient(to right, var(--sec-profile), transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: '150px',
        background: 'linear-gradient(to left, var(--sec-profile), transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      <div className="marquee-inner">
        {MARQUEE_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              padding: '0 2.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <span style={{ color: 'var(--accent)', opacity: 0.5 }}>✦</span>
            <span className="font-syne" style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--fg)',
              opacity: 0.8,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
