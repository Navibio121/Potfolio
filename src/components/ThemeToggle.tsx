'use client';

import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Moon, Layers, Minus, Sun } from 'lucide-react';

const THEMES = [
  { id: 'dark'    as const, icon: Moon,   label: 'Cinematic' },
  { id: 'glass'   as const, icon: Layers, label: 'Glass'     },
  { id: 'minimal' as const, icon: Minus,  label: 'Minimal'   },
  { id: 'light'   as const, icon: Sun,    label: 'Light'     },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [hovered, setHovered] = useState<string|null>(null);

  return (
    <div style={{
      position:'fixed', bottom:'2rem', right:'2rem', zIndex:9998,
      display:'flex', alignItems:'center', gap:'4px',
      padding:'6px',
      borderRadius:'999px',
      background:'rgba(13,11,26,0.85)',
      border:'1px solid rgba(var(--accent-rgb), 0.15)',
      backdropFilter:'blur(20px)',
      boxShadow:'0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(var(--accent-rgb), 0.2)',
    }}>
      {THEMES.map(({ id, icon:Icon, label }) => {
        const active = theme===id;
        const hover  = hovered===id;
        return (
          <div key={id} style={{ position:'relative' }}>
            <button
              onClick={()=>setTheme(id)}
              onMouseEnter={()=>setHovered(id)}
              onMouseLeave={()=>setHovered(null)}
              title={label}
              style={{
                display:'flex', alignItems:'center', justifyContent:'center',
                width:'38px', height:'38px', borderRadius:'50%',
                border:'none', cursor:'pointer',
                background: active
                  ? 'linear-gradient(135deg,var(--accent),var(--accent2))'
                  : hover ? 'rgba(var(--accent-rgb), 0.15)' : 'transparent',
                color: active ? '#080808' : hover ? 'var(--accent)' : 'rgba(255,255,255,0.45)',
                transform: active ? 'scale(1.15)' : 'scale(1)',
                boxShadow: active ? '0 0 16px rgba(var(--accent-rgb), 0.35)' : 'none',
                transition:'all 0.25s ease',
              }}
            >
              <Icon size={16} />
            </button>
            {hover && (
              <div style={{
                position:'absolute', bottom:'calc(100% + 10px)', left:'50%', transform:'translateX(-50%)',
                background:'rgba(13,11,26,0.95)', color:'#fff',
                fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.1em',
                padding:'5px 10px', borderRadius:'6px',
                border:'1px solid rgba(var(--accent-rgb), 0.25)',
                whiteSpace:'nowrap', pointerEvents:'none',
                backdropFilter:'blur(10px)',
              }}>
                {label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
