'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, ArrowRight } from 'lucide-react';

export default function BookCallSection({ isAdmin = false }: { isAdmin?: boolean }) {
  const [url, setUrl] = useState('https://calendly.com/yourname');
  const [editingUrl, setEditingUrl] = useState(false);

  return (
    <motion.section
      id="book"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
      style={{ padding:'7rem 5%', background:'var(--bg2)', position:'relative', overflow:'hidden' }}
    >
      {/* Background glow */}
      <div style={{ position:'absolute', top:'-100px', right:'-100px', width:'500px', height:'500px', borderRadius:'50%', background:'rgba(var(--accent-rgb), 0.08)', filter:'blur(80px)', pointerEvents:'none' }} />

      <div style={{ maxWidth:'1200px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:'5rem', alignItems:'center', position:'relative', zIndex:1 }}>

        {/* Left */}
        <div>
          <p className="sec-label">LET'S TALK</p>
          <h2 className="font-bebas" style={{ fontSize:'clamp(2.5rem,5vw,4.5rem)', color:'#fff', lineHeight:1, marginBottom:'1.5rem' }}>
            BOOK A <span className="gradient-text">DISCOVERY CALL</span>
          </h2>
          <p style={{ color:'var(--muted)', fontSize:'1.05rem', lineHeight:1.8, marginBottom:'3rem' }}>
            Ready to bring your project to life? Schedule a 30-minute consultation to discuss your vision, scope, and technical requirements.
          </p>

          <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
            {[
              { icon:<Calendar size={22}/>, text:'Pick a time that works for you' },
              { icon:<Clock size={22}/>, text:'30-minute deep-dive session' },
              { icon:<Video size={22}/>, text:'Held via video call' },
            ].map((item,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'1.25rem' }}>
                <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'rgba(var(--accent-rgb), 0.05)', border:'1px solid rgba(var(--accent-rgb), 0.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--accent)', flexShrink:0 }}>
                  {item.icon}
                </div>
                <span style={{ color:'rgba(255,255,255,0.75)', fontWeight:600 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card */}
        <div style={{ background:'var(--gradient-card)', border:'1px solid var(--glass-border)', borderRadius:'24px', padding:'3.5rem 2.5rem', textAlign:'center', position:'relative' }}>
          <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'linear-gradient(135deg,rgba(var(--accent-rgb), 0.1),rgba(245,215,142,0.05))', margin:'0 auto 2rem', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--glow-cyan)' }}>
            <Calendar size={36} color="var(--accent)" />
          </div>

          <h3 className="font-bebas" style={{ fontSize:'2rem', color:'#fff', marginBottom:'1rem' }}>SELECT YOUR SLOT</h3>
          <p style={{ color:'var(--muted)', marginBottom:'2.5rem', lineHeight:1.6 }}>
            Check availability and book directly into the schedule.
          </p>

          {editingUrl ? (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              <input value={url} onChange={e=>setUrl(e.target.value)} className="cinema-input" placeholder="Calendly URL" />
              <button onClick={()=>setEditingUrl(false)} className="btn-pill-dot" style={{ justifyContent:'center', borderRadius:'10px' }}>
                <span>SAVE URL</span>
                <span className="dot-circle" />
              </button>
            </div>
          ) : (
            <button onClick={()=>window.open(url,'_blank')} className="btn-pill-dot" style={{ width:'100%', justifyContent:'center', borderRadius:'12px', fontSize:'1rem' }}>
              <span>SCHEDULE NOW</span>
              <span className="dot-circle" />
            </button>
          )}

          {isAdmin && !editingUrl && (
            <button onClick={()=>setEditingUrl(true)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.2)', cursor:'pointer', marginTop:'1.25rem', fontSize:'0.72rem', letterSpacing:'0.1em', fontWeight:700 }}>
              [ EDIT BOOKING URL ]
            </button>
          )}
        </div>
      </div>
    </motion.section>
  );
}
