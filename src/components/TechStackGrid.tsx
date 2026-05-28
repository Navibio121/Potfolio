'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const DEFAULT_TOOLS = [
  { name:'Blender', role:'3D Modeling', icon:'🎯' },
  { name:'Unreal Engine', role:'Environments', icon:'🎮' },
  { name:'Substance Painter', role:'Texturing', icon:'🎨' },
  { name:'ZBrush', role:'Sculpting', icon:'🗿' },
  { name:'After Effects', role:'Motion', icon:'✨' },
  { name:'Figma', role:'UI / UX', icon:'🖼️' },
];

export default function TechStackGrid({ isAdmin = false }: { isAdmin?: boolean }) {
  const [tools, setTools] = useState<any[]>(DEFAULT_TOOLS);
  const [adding, setAdding] = useState(false);
  const [newTool, setNewTool] = useState({ name:'', role:'', icon:'✨' });

  useEffect(() => {
    supabase.from('artist_settings').select('tech_stack').eq('id',1).single().then(({ data }) => {
      if (data?.tech_stack?.length) setTools(data.tech_stack);
    });
  }, []);

  const persist = async (list: any[]) => {
    setTools(list);
    await supabase.from('artist_settings').update({ tech_stack:list }).eq('id',1);
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    await persist([...tools, newTool]);
    setAdding(false);
    setNewTool({ name:'', role:'', icon:'✨' });
  };

  const remove = async (name: string) => persist(tools.filter(t=>t.name!==name));

  // Motion variants for stagger entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }
    }
  };

  return (
    <motion.section 
      id="tech" 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
      style={{ padding:'7rem 5%', background:'var(--bg2)' }}
    >
      <div style={{ maxWidth:'1300px', margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'4rem', flexWrap:'wrap', gap:'1.5rem' }}>
          <div>
            <p className="sec-label">TECHNICAL ARSENAL</p>
            <h2 className="font-bebas" style={{ fontSize:'clamp(2.5rem,5vw,4rem)', color:'#fff', margin:0, lineHeight:1 }}>
              TOOLS &amp; <span className="gradient-text">MASTERY</span>
            </h2>
          </div>
          {isAdmin && (
            <button onClick={()=>setAdding(true)} className="btn-outline" style={{ display:'flex', alignItems:'center', gap:'8px', borderRadius:'10px' }}>
              <Plus size={16} /> ADD TOOL
            </button>
          )}
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'1.25rem' }}
        >
          {tools.map(t => (
            <motion.div 
              key={t.name}
              variants={cardVariants}
              whileHover={{ y:-6, boxShadow:'var(--glow-cyan)' }}
              style={{ background:'var(--gradient-card)', border:'1px solid var(--card-border)', borderRadius:'16px', padding:'1.75rem 1.25rem', textAlign:'center', position:'relative', cursor:'default', transition:'border-color 0.25s' }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor='var(--accent)'}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor='var(--card-border)'}
            >
              {isAdmin && (
                <button onClick={()=>remove(t.name)} style={{ position:'absolute', top:'8px', right:'8px', background:'rgba(239,68,68,0.15)', border:'none', color:'#ef4444', borderRadius:'50%', width:'24px', height:'24px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <X size={12} />
                </button>
              )}
              <div style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>{t.icon}</div>
              <p style={{ margin:0, fontWeight:800, fontSize:'0.95rem', color:'#fff' }}>{t.name}</p>
              <p style={{ margin:'4px 0 0', fontSize:'0.7rem', color:'var(--accent)', fontWeight:700, letterSpacing:'0.08em' }}>{t.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Add Tool Modal */}
      <AnimatePresence>
        {adding && (
          <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(7,7,15,0.9)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
              style={{ background:'#0d0b1a', border:'1px solid var(--glass-border)', borderRadius:'20px', padding:'2.5rem', width:'100%', maxWidth:'400px' }}
            >
              <h3 className="font-bebas" style={{ fontSize:'2rem', marginBottom:'1.5rem', color:'#fff' }}>ADD TOOL</h3>
              <form onSubmit={add} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <input required placeholder="Tool name" value={newTool.name} onChange={e=>setNewTool({...newTool,name:e.target.value})} className="cinema-input" />
                <input required placeholder="Role / Specialization" value={newTool.role} onChange={e=>setNewTool({...newTool,role:e.target.value})} className="cinema-input" />
                <input placeholder="Icon (emoji)" value={newTool.icon} onChange={e=>setNewTool({...newTool,icon:e.target.value})} className="cinema-input" />
                <div style={{ display:'flex', gap:'1rem', marginTop:'0.5rem' }}>
                  <button type="submit" className="btn-neon" style={{ flex:1, justifyContent:'center', borderRadius:'10px' }}>ADD</button>
                  <button type="button" onClick={()=>setAdding(false)} className="btn-outline" style={{ flex:1, justifyContent:'center', borderRadius:'10px' }}>CANCEL</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
