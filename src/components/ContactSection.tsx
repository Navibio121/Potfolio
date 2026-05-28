'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, CheckCircle2, Send, AtSign, MessageCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ContactSection() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'direct'|'form'>('direct');
  const [form, setForm] = useState({ discord:'', social:'' });
  const [sent, setSent] = useState(false);

  const DISCORD = 'ariavoss#0001';
  const EMAIL   = 'collab@ariavoss.art';

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('contact_messages').insert([{ discord_handle:form.discord, social_handle:form.social }]);
    setSent(true);
    setTimeout(()=>{ setSent(false); setOpen(false); setForm({ discord:'', social:'' }); }, 3000);
  };

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
      style={{ padding:'9rem 5%', background:'var(--bg)', textAlign:'center', position:'relative', overflow:'hidden' }}
    >
      {/* Glow blobs */}
      <div style={{ position:'absolute', top:'30%', left:'-150px', width:'400px', height:'400px', borderRadius:'50%', background:'rgba(var(--accent-rgb), 0.08)', filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'10%', right:'-100px', width:'350px', height:'350px', borderRadius:'50%', background:'rgba(245,215,142,0.05)', filter:'blur(80px)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:1 }}>
        <p className="sec-label" style={{ justifyContent:'center' }}>CONTACT</p>
        <h2 className="font-bebas" style={{ fontSize:'clamp(3rem,9vw,8rem)', color:'#fff', lineHeight:1, margin:'1rem 0 1.5rem' }}>
          LET'S <span className="gradient-text">BUILD</span><br />
          <span style={{ fontFamily:'var(--font-playfair)', fontStyle:'italic', fontSize:'0.65em', color:'var(--muted)' }}>something great.</span>
        </h2>

        {!open ? (
          <button onClick={()=>setOpen(true)} className="btn-pill-dot" style={{ fontSize:'1.1rem', padding:'18px 44px', borderRadius:'50px', margin:'0 auto' }}>
            <span>GET IN TOUCH</span>
            <span className="dot-circle" />
          </button>
        ) : (
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
            style={{ background:'var(--gradient-card)', border:'1px solid var(--glass-border)', borderRadius:'20px', padding:'2.5rem', maxWidth:'420px', margin:'0 auto', position:'relative', textAlign:'left' }}
          >
            <button onClick={()=>setOpen(false)} style={{ position:'absolute', top:'1.25rem', right:'1.25rem', background:'rgba(255,255,255,0.06)', border:'none', color:'#fff', borderRadius:'50%', width:'32px', height:'32px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <X size={16} />
            </button>

            {sent ? (
              <div style={{ textAlign:'center', padding:'2rem 0' }}>
                <CheckCircle2 size={56} color="var(--accent)" style={{ margin:'0 auto 1rem' }} />
                <h3 className="font-bebas" style={{ fontSize:'2rem', color:'#fff' }}>MESSAGE SENT!</h3>
                <p style={{ color:'var(--muted)' }}>I'll get back to you soon.</p>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div style={{ display:'flex', gap:'1.5rem', marginBottom:'2rem', borderBottom:'1px solid rgba(255,255,255,0.08)', paddingBottom:'1rem' }}>
                  {(['direct','form'] as const).map(t=>(
                    <button key={t} onClick={()=>setTab(t)} style={{ background:'none', border:'none', fontWeight:900, fontSize:'0.8rem', letterSpacing:'0.12em', cursor:'pointer', color:tab===t?'var(--accent)':'rgba(255,255,255,0.3)', textTransform:'uppercase', paddingBottom:'4px', borderBottom:tab===t?'2px solid var(--accent)':'2px solid transparent', transition:'all 0.2s' }}>
                      {t==='direct'?'DIRECT':'SEND INFO'}
                    </button>
                  ))}
                </div>

                {tab==='direct' ? (
                  <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                    <CopyItem label="DISCORD" icon={<MessageCircle size={16}/>} value={DISCORD} />
                    <CopyItem label="EMAIL" icon={<AtSign size={16}/>} value={EMAIL} />
                  </div>
                ) : (
                  <form onSubmit={handleSend} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                    <div>
                      <p style={{ fontSize:'0.68rem', fontWeight:900, color:'var(--muted)', letterSpacing:'0.15em', marginBottom:'6px' }}>DISCORD HANDLE</p>
                      <input value={form.discord} onChange={e=>setForm({...form,discord:e.target.value})} className="cinema-input" placeholder="user#0000" />
                    </div>
                    <div>
                      <p style={{ fontSize:'0.68rem', fontWeight:900, color:'var(--muted)', letterSpacing:'0.15em', marginBottom:'6px' }}>SOCIAL / PROJECT LINK</p>
                      <input value={form.social} onChange={e=>setForm({...form,social:e.target.value})} className="cinema-input" placeholder="https://..." />
                    </div>
                    <button type="submit" className="btn-pill-dot" style={{ justifyContent:'center', borderRadius:'10px', marginTop:'0.5rem', width: '100%' }}>
                      <span>SEND</span>
                      <span className="dot-circle" />
                    </button>
                  </form>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}

function CopyItem({ label, icon, value }: any) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(()=>setCopied(false), 2000); };
  return (
    <div>
      <p style={{ fontSize:'0.68rem', fontWeight:900, color:'var(--muted)', letterSpacing:'0.15em', marginBottom:'6px' }}>{label}</p>
      <div onClick={copy} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid var(--card-border)', borderRadius:'10px', padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', transition:'border-color 0.2s' }}
        onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor='var(--accent)'}
        onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor='var(--card-border)'}
      >
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <span style={{ color:'var(--accent)' }}>{icon}</span>
          <span style={{ color:'#fff', fontWeight:700, fontSize:'0.95rem' }}>{value}</span>
        </div>
        {copied ? <CheckCircle2 size={16} color="var(--accent)" /> : <Copy size={16} color="rgba(255,255,255,0.2)" />}
      </div>
    </div>
  );
}
