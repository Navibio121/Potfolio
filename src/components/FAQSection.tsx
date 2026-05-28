'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus } from 'lucide-react';

const FAQS = [
  {
    q: "Do you require upfront payment?",
    a: "Yes, I require a 50% upfront deposit to secure your slot in my schedule. The remaining 50% is due upon final approval of the watermarked assets, before the source files are delivered."
  },
  {
    q: "What file formats do you deliver?",
    a: "For 3D models, I provide .FBX and .OBJ along with 4K PBR texture maps (PNG/TGA). For UI and 2D assets, I deliver structured .PSD or .FIG source files along with exported PNG sequences."
  },
  {
    q: "How do revisions work?",
    a: "Standard commissions include 2 major revision rounds during the blockout/draft phase. Minor tweaks (like color adjustments) are free, but structural changes after the draft phase will incur an extra fee."
  },
  {
    q: "Can I use your work commercially?",
    a: "All standard commissions include a commercial use license for your specific project (e.g., your Roblox game or indie title). However, you may not resell the raw assets themselves on marketplaces."
  }
];

export default function FAQSection({ isAdmin = false }: { isAdmin?: boolean }) {
  const [faqs, setFaqs] = useState([
    {
      q: "Do you require upfront payment?",
      a: "Yes, I require a 50% upfront deposit to secure your slot in my schedule. The remaining 50% is due upon final approval of the watermarked assets, before the source files are delivered."
    },
    {
      q: "What file formats do you deliver?",
      a: "For 3D models, I provide .FBX and .OBJ along with 4K PBR texture maps (PNG/TGA). For UI and 2D assets, I deliver structured .PSD or .FIG source files along with exported PNG sequences."
    },
    {
      q: "How do revisions work?",
      a: "Standard commissions include 2 major revision rounds during the blockout/draft phase. Minor tweaks (like color adjustments) are free, but structural changes after the draft phase will incur an extra fee."
    },
    {
      q: "Can I use your work commercially?",
      a: "All standard commissions include a commercial use license for your specific project (e.g., your Roblox game or indie title). However, you may not resell the raw assets themselves on marketplaces."
    },
    {
      q: "What do I need to provide to start a project?",
      a: "To begin, I'll need a clear project brief, reference images (or a moodboard), and any technical constraints (like polycount or target engine). The more detail you provide, the faster we can start!"
    },
    {
      q: "How should I send my reference materials?",
      a: "You can send links to Pinterest boards, Google Drive folders, or upload them directly to our Discord thread. Visual references are key to ensuring the final result matches your vision."
    },
    {
      q: "Do I need to have a technical brief ready?",
      a: "It's highly recommended! However, if you're unsure about the technical side, we can define the specifications (file formats, optimization levels, etc.) together during our discovery call."
    }
  ]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isAdding, setIsAdding] = useState(false);
  const [newFaq, setNewFaq] = useState({ q: '', a: '' });

  const deleteFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const addFaq = (e: React.FormEvent) => {
    e.preventDefault();
    setFaqs([...faqs, newFaq]);
    setNewFaq({ q: '', a: '' });
    setIsAdding(false);
  };

  return (
    <section id="faq" style={{
      padding: '6rem 5%',
      background: 'var(--sec-contact)',
      borderTop: '1px solid var(--card-border)',
      position: 'relative',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="sec-label" style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>— FAQ</p>
          <h2 className="font-syne" style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'var(--fg)', margin: 0,
          }}>
            Common Questions
          </h2>
          <button 
            onClick={() => {
              if (!isAdmin) {
                alert('Admin Mode Required.');
                return;
              }
              setIsAdding(true);
            }}
            style={{ 
              marginTop: '1rem', padding: '8px 16px', borderRadius: '8px', 
              background: isAdmin ? 'var(--card-bg)' : 'transparent', 
              border: isAdmin ? '1px solid var(--accent)' : '1px dashed var(--card-border)', 
              color: isAdmin ? 'var(--accent)' : 'var(--muted)', 
              fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' 
            }}
          >
            <Plus size={16} /> Add FAQ
            {!isAdmin && <span style={{ fontSize: '0.65rem', background: 'var(--accent)22', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px' }}>LOCKED</span>}
          </button>
        </div>

        {isAdding && (
           <div style={{ marginBottom: '2rem', padding: '2rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px' }}>
             <form onSubmit={addFaq} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <input required placeholder="Question" value={newFaq.q} onChange={e => setNewFaq({...newFaq, q: e.target.value})} style={inputStyle} />
               <textarea required placeholder="Answer" value={newFaq.a} onChange={e => setNewFaq({...newFaq, a: e.target.value})} style={{...inputStyle, height: '80px', resize: 'none'}} />
               <div style={{ display: 'flex', gap: '1rem' }}>
                 <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Save FAQ</button>
                 <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--fg)', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
               </div>
             </form>
           </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'border-color 0.3s ease',
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--fg)',
                  fontFamily: 'var(--font-syne)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textAlign: 'left',
                }}
              >
                {faq.q}
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{ color: openIndex === i ? 'var(--accent)' : 'var(--muted)' }}
                >
                  <ChevronDown size={20} />
                </motion.div>
                {isAdmin && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteFaq(i); }}
                    style={{ marginLeft: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div style={{
                      padding: '0 1.5rem 1.5rem',
                      color: 'var(--muted)',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      fontFamily: 'var(--font-inter)',
                    }}>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--card-border)', color: 'var(--fg)', fontSize: '0.9rem', outline: 'none'
};

import { Trash2 } from 'lucide-react';
