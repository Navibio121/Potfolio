'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Handshake, 
  Cpu, 
  Layers, 
  Video, 
  Sparkles, 
  CreditCard, 
  Package, 
  CheckCircle,
  ArrowRight,
  ArrowDown
} from 'lucide-react';

export default function ProjectProcess() {
  const phases = [
    {
      id: '01',
      title: 'Submit Brief',
      subtitle: 'Buyer Stage',
      role: 'BUYER',
      icon: FileText,
      description: 'Game type · style references · budget boundary · deadline expectations.',
      color: 'var(--accent)',
      category: 'START',
    },
    {
      id: '02',
      title: 'Review & Agree',
      subtitle: 'Developer Stage',
      role: 'DEV',
      icon: Handshake,
      description: 'Detailed quotation · scope documentation · mutual agreement · 50% deposit.',
      color: '#ADFF4F',
      category: 'START',
    },
    {
      id: '03',
      title: 'Work Begins',
      subtitle: 'Active Development',
      role: 'BUILD',
      icon: Cpu,
      description: 'Active development phase with progress tracked live via updates.',
      color: '#ADFF4F',
      category: 'BUILD',
      updates: [
        {
          id: 'u1',
          tag: 'Updates 1–2',
          title: 'Early Foundations',
          description: 'Basic shape, blocking, structural screenshots, and notes.',
          icon: Layers,
        },
        {
          id: 'u2',
          tag: 'Update 3',
          title: 'Mid-Build Review',
          description: 'Mid-build cinematic video clip. Buyer can review & comment.',
          icon: Video,
        },
        {
          id: 'u3',
          tag: 'Updates 4–5',
          title: 'Near-Complete',
          description: 'Polishing details and requesting near-complete build approval.',
          icon: Sparkles,
        }
      ]
    },
    {
      id: '04',
      title: 'Remaining 50%',
      subtitle: 'Payment Phase',
      role: 'PAYMENT',
      icon: CreditCard,
      description: 'Remaining 50% payment processed. Confirmed before final files release.',
      color: '#ADFF4F',
      category: 'SHIP',
    },
    {
      id: '05',
      title: 'Final Delivery',
      subtitle: 'Asset Handover',
      role: 'DELIVERY',
      icon: Package,
      description: 'Polished assets delivered (including .ZIP containing source files: .rbxl, .spt, etc.) for buyer approval.',
      color: '#ADFF4F',
      category: 'SHIP',
    },
    {
      id: '06',
      title: 'Payment & Close',
      subtitle: 'Project Finalized',
      role: 'DONE',
      icon: CheckCircle,
      description: 'Project concluded. Final rating and testimonial submission.',
      color: '#ADFF4F',
      category: 'CLOSE',
    }
  ];

  return (
    <section 
      id="process" 
      style={{ 
        position: 'relative', 
        padding: '8rem 5% 9rem', 
        background: '#070906', 
        overflow: 'hidden',
        borderTop: '1px solid rgba(173, 255, 79, 0.08)'
      }}
    >
      {/* ── Stunning & Amazing Background ── */}
      <div 
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 50% 20%, rgba(173, 255, 79, 0.06) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(173, 255, 79, 0.03) 0%, transparent 50%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
      
      {/* Animated glowing mesh line */}
      <div 
        style={{
          position: 'absolute',
          top: '30%',
          left: '10%',
          right: '10%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(173, 255, 79, 0.25), rgba(173, 255, 79, 0.05), transparent)',
          filter: 'blur(4px)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
      
      <div 
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '5%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'rgba(173, 255, 79, 0.025)',
          filter: 'blur(120px)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* ── Section Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div className="sec-label" style={{ justifyContent: 'center' }}>
            Workflow & Roadmap
          </div>
          <h2 className="font-syne" style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            color: 'var(--fg)',
            margin: '0 0 1.25rem',
            letterSpacing: '-0.02em'
          }}>
            Project <span className="gradient-text">Process</span>
          </h2>
          <p style={{
            color: 'var(--muted)',
            fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            A highly structured, transparent pipeline engineered to deliver precision results from initial brief to final deployment.
          </p>
        </div>

        {/* ── Desktop & Mobile Responsive Grid Layout ── */}
        <div className="process-flow-container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* PHASE 1: START */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(173, 255, 79, 0.1)', paddingBottom: '0.75rem' }}>
              <span className="font-syncopate" style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '0.2em' }}>PHASE 01 // START</span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}>
              {phases.filter(p => p.category === 'START').map((step) => (
                <motion.div
                  key={step.id}
                  whileHover={{ y: -5, borderColor: 'rgba(173, 255, 79, 0.35)' }}
                  style={{
                    background: 'rgba(20, 26, 18, 0.4)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(173, 255, 79, 0.08)',
                    borderRadius: '16px',
                    padding: '2rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 0, right: 0,
                    padding: '6px 16px', borderBottomLeftRadius: '12px',
                    background: 'rgba(173, 255, 79, 0.1)',
                    fontSize: '0.68rem', fontWeight: 900, color: 'var(--accent)',
                    letterSpacing: '0.1em'
                  }}>
                    {step.role}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: '46px', height: '46px', borderRadius: '12px',
                      background: 'rgba(173, 255, 79, 0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--accent)', border: '1px solid rgba(173, 255, 79, 0.15)'
                    }}>
                      <step.icon size={22} />
                    </div>
                    <div>
                      <div style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.15em' }}>STEP {step.id}</div>
                      <h3 className="font-syne" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--fg)', marginTop: '2px' }}>{step.title}</h3>
                    </div>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Connect line for desktop */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 0' }}>
            <ArrowDown style={{ color: 'var(--accent)', opacity: 0.3 }} size={28} />
          </div>

          {/* PHASE 2: BUILD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(173, 255, 79, 0.1)', paddingBottom: '0.75rem' }}>
              <span className="font-syncopate" style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '0.2em' }}>PHASE 02 // ACTIVE BUILD</span>
            </div>
            
            {phases.filter(p => p.category === 'BUILD').map((step) => (
              <div key={step.id} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <motion.div
                  whileHover={{ borderColor: 'rgba(173, 255, 79, 0.35)' }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(20, 26, 18, 0.5), rgba(10, 13, 9, 0.3))',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(173, 255, 79, 0.15)',
                    borderRadius: '20px',
                    padding: '2.5rem',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 0, right: 0,
                    padding: '8px 20px', borderBottomLeftRadius: '16px',
                    background: 'var(--accent)',
                    fontSize: '0.72rem', fontWeight: 900, color: '#0A0D09',
                    letterSpacing: '0.15em'
                  }}>
                    {step.role}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.75rem' }}>
                    <div style={{
                      width: '54px', height: '54px', borderRadius: '14px',
                      background: 'rgba(173, 255, 79, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--accent)', border: '1px solid rgba(173, 255, 79, 0.25)',
                      boxShadow: 'var(--glow-gold2)'
                    }}>
                      <step.icon size={26} />
                    </div>
                    <div>
                      <div style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.15em' }}>STEP {step.id}</div>
                      <h3 className="font-syne" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--fg)', marginTop: '2px' }}>{step.title}</h3>
                    </div>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '800px', marginBottom: '2rem' }}>
                    {step.description}
                  </p>

                  {/* Micro updates timeline branches */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.25rem',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    {step.updates?.map((up) => (
                      <div 
                        key={up.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '12px',
                          padding: '1.5rem',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(173, 255, 79, 0.2)';
                          e.currentTarget.style.background = 'rgba(173, 255, 79, 0.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 900,
                            letterSpacing: '0.08em',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            background: 'rgba(173, 255, 79, 0.08)',
                            color: 'var(--accent)',
                            border: '1px solid rgba(173, 255, 79, 0.12)'
                          }}>
                            {up.tag}
                          </span>
                          <up.icon size={16} style={{ color: 'var(--accent)', opacity: 0.6 }} />
                        </div>
                        <h4 className="font-syne" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--fg)' }}>{up.title}</h4>
                        <p style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>
                          {up.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Connect line for desktop */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 0' }}>
            <ArrowDown style={{ color: 'var(--accent)', opacity: 0.3 }} size={28} />
          </div>

          {/* PHASE 3: SHIP */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(173, 255, 79, 0.1)', paddingBottom: '0.75rem' }}>
              <span className="font-syncopate" style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '0.2em' }}>PHASE 03 // SHIP & DELIVERY</span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}>
              {phases.filter(p => p.category === 'SHIP').map((step) => (
                <motion.div
                  key={step.id}
                  whileHover={{ y: -5, borderColor: 'rgba(173, 255, 79, 0.35)' }}
                  style={{
                    background: 'rgba(20, 26, 18, 0.4)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(173, 255, 79, 0.08)',
                    borderRadius: '16px',
                    padding: '2rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 0, right: 0,
                    padding: '6px 16px', borderBottomLeftRadius: '12px',
                    background: 'rgba(173, 255, 79, 0.1)',
                    fontSize: '0.68rem', fontWeight: 900, color: 'var(--accent)',
                    letterSpacing: '0.1em'
                  }}>
                    {step.role}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: '46px', height: '46px', borderRadius: '12px',
                      background: 'rgba(173, 255, 79, 0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--accent)', border: '1px solid rgba(173, 255, 79, 0.15)'
                    }}>
                      <step.icon size={22} />
                    </div>
                    <div>
                      <div style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.15em' }}>STEP {step.id}</div>
                      <h3 className="font-syne" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--fg)', marginTop: '2px' }}>{step.title}</h3>
                    </div>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Connect line for desktop */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 0' }}>
            <ArrowDown style={{ color: 'var(--accent)', opacity: 0.3 }} size={28} />
          </div>

          {/* PHASE 4: CLOSE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(173, 255, 79, 0.1)', paddingBottom: '0.75rem' }}>
              <span className="font-syncopate" style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '0.2em' }}>PHASE 04 // FINALIZATION</span>
            </div>
            
            {phases.filter(p => p.category === 'CLOSE').map((step) => (
              <motion.div
                key={step.id}
                whileHover={{ borderColor: 'var(--accent)' }}
                style={{
                  background: 'linear-gradient(135deg, rgba(20, 26, 18, 0.6), rgba(173, 255, 79, 0.03))',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(173, 255, 79, 0.2)',
                  borderRadius: '20px',
                  padding: '2.5rem',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  padding: '8px 24px', borderBottomLeftRadius: '16px',
                  background: 'var(--accent)',
                  fontSize: '0.72rem', fontWeight: 900, color: '#0A0D09',
                  letterSpacing: '0.15em'
                }}>
                  {step.role}
                </div>
                
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '54px', height: '54px', borderRadius: '14px',
                    background: 'rgba(173, 255, 79, 0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent)', border: '1px solid var(--accent)',
                    boxShadow: 'var(--glow-gold)'
                  }}>
                    <step.icon size={26} />
                  </div>
                  <div>
                    <div style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.15em' }}>STEP {step.id}</div>
                    <h3 className="font-syne" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--fg)', marginTop: '2px' }}>{step.title}</h3>
                  </div>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '800px', margin: 0 }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
