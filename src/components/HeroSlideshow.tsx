'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const SIDEBAR_LINKS = [
  { label: 'PORTFOLIO', href: '#portfolio' },
  { label: 'ABOUT',     href: '#about'    },
  { label: 'SKILLS',    href: '#tech'     },
  { label: 'PRICING',   href: '#pricing'  },
  { label: 'FAQ',       href: '#faq'      },
  { label: 'BOOK CALL', href: '#book'     },
  { label: 'CONTACT',   href: '#contact'  },
];

export default function HeroSlideshow({ 
  onLogoClick, 
  initialProjects = [] 
}: { 
  onLogoClick?: () => void;
  initialProjects?: any[];
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  React.useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      setProjects(initialProjects.map((p: any) => p.url || p.image_url).filter(Boolean));
    } else {
      fetchHeroProjects();
    }
  }, [initialProjects]);

  const fetchHeroProjects = async () => {
    const { data } = await supabase
      .from('portfolio_works')
      .select('url, image_url')
      .limit(5);
    
    if (data && data.length > 0) {
      setProjects(data.map((p: any) => p.url || p.image_url).filter(Boolean));
    }
  };

  React.useEffect(() => {
    if (projects.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(s => (s + 1) % projects.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [projects]);

  const scrollTo = (href: string, closeSidebar = false) => {
    if (closeSidebar) setSidebarOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, closeSidebar ? 350 : 0);
  };

  return (
    <section style={{
      position: 'relative', height: '100vh', width: '100%',
      overflow: 'hidden', background: '#07070f',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* ── Background Slideshow ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <AnimatePresence mode="wait">
          {projects.length > 0 ? (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              style={{
                position: 'absolute', inset: 0,
                background: `url(${projects[currentSlide]}) center/cover no-repeat`,
              }}
            />
          ) : (
             <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-hero)', opacity: 0.5 }} />
          )}
        </AnimatePresence>
        {/* Dark overlay for readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,7,15,0.7) 0%, #07070f 100%)' }} />
      </div>

      {/* ── Ambient Orbs ── */}
      <div className="orb" style={{ width: '600px', height: '600px', background: 'rgba(var(--accent-rgb), 0.08)', top: '-150px', right: '-100px', zIndex: 1 }} />
      <div className="orb" style={{ width: '400px', height: '400px', background: 'rgba(245,215,142,0.05)', bottom: '-100px', left: '10%', animationDelay: '-10s', zIndex: 1 }} />

      {/* ── Top Navigation ── */}
      <nav style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '2rem 5%',
        background: 'linear-gradient(to bottom,rgba(7,7,15,0.9) 0%,transparent 100%)',
      }}>
        {/* Logo — triple-click = admin */}
        <div
          className="font-bebas"
          onClick={onLogoClick}
          style={{
            fontSize: '1.6rem', color: '#fff', letterSpacing: '0.12em',
            cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '8px',
          }}
        >
          <div style={{
            width: '28px', height: '28px', borderRadius: '6px',
            background: 'linear-gradient(135deg,var(--accent),var(--accent2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: '0.85rem' }}>V</span>
          </div>
          VISIONARY<span style={{ color: 'var(--accent)' }}>PORT</span>
        </div>

        {/* Right: PORTFOLIO link + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <a
            href="#portfolio"
            onClick={e => { e.preventDefault(); scrollTo('#portfolio'); }}
            style={{
              color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 900,
              textDecoration: 'none', letterSpacing: '0.2em', textTransform: 'uppercase',
              borderBottom: '1px solid var(--accent)', paddingBottom: '2px',
            }}
          >
            PORTFOLIO
          </a>
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', flexDirection: 'column', gap: '5px' }}
          >
            <span style={{ width: '24px', height: '2px', background: '#fff', display: 'block' }} />
            <span style={{ width: '16px', height: '2px', background: '#fff', display: 'block' }} />
            <span style={{ width: '24px', height: '2px', background: '#fff', display: 'block' }} />
          </button>
        </div>
      </nav>

      {/* ── Sidebar ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div key="bd" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setSidebarOpen(false)}
              style={{ position:'fixed', inset:0, zIndex:998, background:'rgba(7,7,15,0.85)', backdropFilter:'blur(8px)' }} />

            <motion.aside key="sb"
              initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
              transition={{ type:'tween', duration:0.35, ease:'easeInOut' }}
              style={{
                position:'fixed', top:0, right:0, bottom:0, width:'min(340px,88vw)',
                zIndex:999, background:'#0d0b1a',
                borderLeft:'1px solid rgba(var(--accent-rgb), 0.15)',
                padding:'3.5rem 2.5rem',
                display:'flex', flexDirection:'column', gap:0,
              }}
            >
              {/* Glow accent line */}
              <div style={{ position:'absolute', top:0, left:0, bottom:0, width:'3px', background:'linear-gradient(to bottom,var(--accent),var(--accent2))' }} />

              <button onClick={() => setSidebarOpen(false)} style={{ position:'absolute', top:'1.5rem', right:'1.5rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', borderRadius:'50%', width:'40px', height:'40px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <X size={20} />
              </button>

              <p style={{ fontSize:'0.65rem', fontWeight:900, color:'var(--accent)', letterSpacing:'0.3em', marginBottom:'3rem' }}>— NAVIGATE</p>

              <nav style={{ display:'flex', flexDirection:'column' }}>
                {SIDEBAR_LINKS.map(({ label, href }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    onClick={e => { e.preventDefault(); scrollTo(href, true); }}
                    initial={{ opacity:0, x:20 }}
                    animate={{ opacity:1, x:0 }}
                    transition={{ delay:0.05*i }}
                    style={{
                      color:'rgba(255,255,255,0.75)', textDecoration:'none',
                      fontFamily:'var(--font-bebas)', fontSize:'clamp(1.8rem,4vw,2.5rem)',
                      letterSpacing:'0.05em', lineHeight:1,
                      padding:'0.85rem 0', borderBottom:'1px solid rgba(255,255,255,0.05)',
                      transition:'color 0.2s, padding-left 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color='var(--accent)'; (e.currentTarget as HTMLElement).style.paddingLeft='10px'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.75)'; (e.currentTarget as HTMLElement).style.paddingLeft='0'; }}
                  >
                    {label}
                  </motion.a>
                ))}
              </nav>

              <a
                href="#contact"
                onClick={e => { e.preventDefault(); scrollTo('#contact', true); }}
                className="btn-neon"
                style={{ marginTop:'auto', justifyContent:'center', borderRadius:'10px' }}
              >
                START A PROJECT <ArrowRight size={18} />
              </a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Rotating Asterisk Ornament ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        style={{
          position: 'absolute',
          top: '140px',
          right: '8%',
          fontSize: '3rem',
          color: 'var(--accent)',
          fontFamily: 'var(--font-bebas)',
          fontWeight: 'bold',
          opacity: 0.5,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        ★
      </motion.div>

      {/* ── Hero Content ── */}
      <div style={{
        position:'relative', zIndex:10, flex:1,
        display:'flex', alignItems:'center',
        padding:'0 5%',
      }}>
        <div style={{ maxWidth:'850px' }}>
          <p className="sec-label" style={{ marginBottom:'1.5rem' }}>CINEMATIC DIGITAL ART</p>

          <div style={{ marginBottom: '2.5rem' }}>
            <h1 className="font-bebas" style={{
              fontSize: 'clamp(3.8rem, 9.5vw, 8.5rem)', lineHeight: 0.9,
              color: '#fff', letterSpacing: '-0.01em',
              display: 'flex', flexDirection: 'column', gap: '0.4rem'
            }}>
              {/* Line 1 */}
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {["CINEMATIC", "DEPTH", "&"].map((word, idx) => (
                  <motion.span
                    key={word}
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: idx * 0.1,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    style={{ display: 'inline-block', marginRight: '1.5rem' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
              
              {/* Line 2 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                {["INNOVATIVE", "ART."].map((word, idx) => {
                  const globalIdx = idx + 3;
                  const isInnovative = word === "INNOVATIVE";
                  return (
                    <motion.span
                      key={word}
                      initial={{ y: 60, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.6,
                        delay: globalIdx * 0.1,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      style={{ 
                        display: 'inline-block', 
                        marginRight: '1.5rem',
                        position: 'relative' 
                      }}
                    >
                      {isInnovative ? (
                        <span style={{ position: 'relative', display: 'inline-block', padding: '0 1rem 0 0.8rem', color: '#0A0D09' }}>
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: globalIdx * 0.1 + 0.6,
                              duration: 0.4,
                              ease: 'easeOut'
                            }}
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'var(--accent)',
                              borderRadius: '999px',
                              zIndex: -1,
                              transformOrigin: 'center',
                            }}
                          />
                          {word}
                        </span>
                      ) : (
                        <span className="gradient-text">{word}</span>
                      )}
                    </motion.span>
                  );
                })}
              </div>
            </h1>
          </div>

          <p style={{ color:'var(--muted)', fontSize:'1.15rem', maxWidth:'480px', lineHeight:1.7, marginBottom:'3rem', fontWeight:500 }}>
            High-fidelity 3D art, immersive environments, and interactive experiences crafted for the next generation of games and digital worlds.
          </p>

          <div style={{ display:'flex', gap:'1.25rem', flexWrap:'wrap', zIndex: 12, position: 'relative' }}>
            <a href="#portfolio" onClick={e => { e.preventDefault(); scrollTo('#portfolio'); }} className="btn-pill-dot">
              <span>VIEW WORK</span>
              <span className="dot-circle" />
            </a>
            <a href="#contact" onClick={e => { e.preventDefault(); scrollTo('#contact'); }} className="btn-outline">
              HIRE ME
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{ position:'absolute', bottom:'2.5rem', left:'50%', transform:'translateX(-50%)', zIndex:10, textAlign:'center' }}>
        <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2, repeat:Infinity }}>
          <ChevronDown size={24} color="rgba(255,255,255,0.25)" />
        </motion.div>
      </div>
    </section>
  );
}
