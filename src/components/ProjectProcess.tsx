'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowDown, 
  HelpCircle, 
  FileText, 
  CheckSquare, 
  Play, 
  Layers, 
  Video, 
  CheckCircle2, 
  DollarSign, 
  Package, 
  Award,
  ChevronRight
} from 'lucide-react';

export default function ProjectProcess() {
  const steps = [
    {
      id: '01',
      phase: 'Start',
      title: 'Submit brief',
      description: 'Game type - style refs - budget - deadline',
      actor: 'BUYER',
      icon: FileText,
      color: '#E07A5F'
    },
    {
      id: '02',
      phase: 'Start',
      title: 'Review & agree',
      description: 'Quote - scope doc - 50% deposit',
      actor: 'DEV',
      icon: CheckSquare,
      color: '#F4F1DE'
    },
    {
      id: '03',
      phase: 'Build',
      title: 'Work begins',
      description: 'Active dev - progress tracked live',
      icon: Play,
      color: '#81B29A',
      branches: [
        {
          id: 'b1',
          tag: 'Update 1-2',
          title: 'Early foundations',
          description: 'screenshots + notes',
          icon: Layers
        },
        {
          id: 'b2',
          tag: 'Update 3',
          title: 'Mid-build review',
          description: 'video clip - buyer can comment',
          icon: Video
        },
        {
          id: 'b3',
          tag: 'Update 4-5',
          title: 'Near-complete build',
          description: 'approval requested',
          icon: CheckCircle2
        }
      ]
    },
    {
      id: '04',
      phase: 'Ship',
      title: 'Remaining 50% payment',
      description: 'Buyer pays balance - confirmed before files',
      actor: 'PAYMENT',
      icon: DollarSign,
      color: '#F2CC8F'
    },
    {
      id: '05',
      phase: 'Ship',
      title: 'Final delivery',
      description: 'Polished build - images - buyer approval',
      sideBubble: 'Source files .rbxl - .spt etc. .ZIP',
      icon: Package,
      color: '#F2CC8F'
    },
    {
      id: '06',
      phase: 'Close',
      title: 'Payment & close',
      description: 'Final 50% - star rating - testimonial',
      actor: 'DONE',
      icon: Award,
      color: '#81B29A'
    }
  ];

  return (
    <section 
      id="process" 
      style={{ 
        position: 'relative', 
        padding: '7rem 5% 8rem', 
        background: '#080B07', 
        overflow: 'hidden',
        borderTop: '1px solid rgba(173, 255, 79, 0.08)'
      }}
    >
      {/* ── BREATHTAKING CARBON GRID TEXTURE & GLOW BACKGROUND ── */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 50% 25%, rgba(173, 255, 79, 0.05) 0%, transparent 60%),
            radial-gradient(circle at 15% 75%, rgba(173, 255, 79, 0.03) 0%, transparent 50%),
            linear-gradient(rgba(173, 255, 79, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(173, 255, 79, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 20px 20px, 20px 20px',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Decorative vertical connection line behind all elements */}
      <div 
        className="hidden-mobile"
        style={{
          position: 'absolute',
          top: '200px',
          bottom: '150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '2px',
          background: 'dashed rgba(173, 255, 79, 0.12)',
          borderLeft: '2px dashed rgba(173, 255, 79, 0.15)',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 3 }}>
        
        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <div className="sec-label" style={{ justifyContent: 'center' }}>
            Workflow & Roadmap
          </div>
          <h2 className="font-syne" style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
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
            fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
            maxWidth: '650px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            The exact vertical flowchart and roadmap illustrating our collaborative pipeline from brief to final delivery.
          </p>
        </div>

        {/* ── FLOWCHART GRID WRAPPER (Responsive Column Layout) ── */}
        <div className="flowchart-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
          
          {/* STEP 01 */}
          <div className="flow-row" style={{ display: 'grid', gridTemplateColumns: '150px 1fr 200px', gap: '2rem', alignItems: 'center' }}>
            {/* Left Phase Label */}
            <div className="flow-left" style={{ textTransform: 'uppercase', fontFamily: 'var(--font-syncopate)', fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent)', opacity: 0.6 }}>
              Start
            </div>
            {/* Center Card */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <div className="flow-card" style={{ width: '100%', maxWidth: '520px', background: 'rgba(20, 26, 18, 0.45)', backdropFilter: 'blur(16px)', border: '1px solid rgba(173, 255, 79, 0.12)', borderRadius: '16px', padding: '1.5rem 2rem', position: 'relative', boxShadow: '0 4px 30px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(224, 122, 95, 0.15)', border: '1px solid rgba(224, 122, 95, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E07A5F' }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-syne" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>01 — Submit brief</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '4px 0 0', lineHeight: 1.4 }}>Game type - style refs - budget - deadline</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Actor Bubble */}
            <div className="flow-right" style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: 'rgba(224, 122, 95, 0.12)', border: '1px solid rgba(224, 122, 95, 0.25)', color: '#E07A5F', padding: '6px 16px', borderRadius: '30px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em' }}>
                BUYER
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flow-arrow-row" style={{ display: 'flex', justifyContent: 'center', margin: '-0.5rem 0' }}>
            <ArrowDown style={{ color: 'rgba(224, 122, 95, 0.4)' }} size={24} />
          </div>

          {/* STEP 02 */}
          <div className="flow-row" style={{ display: 'grid', gridTemplateColumns: '150px 1fr 200px', gap: '2rem', alignItems: 'center' }}>
            <div className="flow-left" style={{ textTransform: 'uppercase', fontFamily: 'var(--font-syncopate)', fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent)', opacity: 0.6 }}>
              {/* Aligned with start */}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <div className="flow-card" style={{ width: '100%', maxWidth: '520px', background: 'rgba(20, 26, 18, 0.45)', backdropFilter: 'blur(16px)', border: '1px solid rgba(173, 255, 79, 0.12)', borderRadius: '16px', padding: '1.5rem 2rem', position: 'relative' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <CheckSquare size={20} />
                  </div>
                  <div>
                    <h3 className="font-syne" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>02 — Review & agree</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '4px 0 0', lineHeight: 1.4 }}>Quote - scope doc - 50% deposit</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flow-right" style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', padding: '6px 16px', borderRadius: '30px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em' }}>
                DEV
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flow-arrow-row" style={{ display: 'flex', justifyContent: 'center', margin: '-0.5rem 0' }}>
            <ArrowDown style={{ color: 'rgba(255, 255, 255, 0.3)' }} size={24} />
          </div>

          {/* STEP 03: Work Begins (Centered) */}
          <div className="flow-row" style={{ display: 'grid', gridTemplateColumns: '150px 1fr 200px', gap: '2rem', alignItems: 'center' }}>
            <div className="flow-left" style={{ textTransform: 'uppercase', fontFamily: 'var(--font-syncopate)', fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent)', opacity: 0.6 }}>
              Build
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <div className="flow-card" style={{ width: '100%', maxWidth: '520px', background: 'linear-gradient(135deg, rgba(129, 178, 154, 0.15), rgba(20, 26, 18, 0.4))', backdropFilter: 'blur(16px)', border: '1px solid rgba(129, 178, 154, 0.3)', borderRadius: '16px', padding: '1.5rem 2rem', position: 'relative', boxShadow: '0 4px 30px rgba(129,178,154,0.1)' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(129, 178, 154, 0.2)', border: '1px solid rgba(129, 178, 154, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#81B29A' }}>
                    <Play size={20} style={{ transform: 'translateX(1px)' }} />
                  </div>
                  <div>
                    <h3 className="font-syne" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>03 — Work begins</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '4px 0 0', lineHeight: 1.4 }}>Active dev - progress tracked live</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flow-right">
              {/* Optional actor alignment or spacer */}
            </div>
          </div>

          {/* Dynamic Nested 3-Branch Updates (PC and Mobile Responsive Grid) */}
          <div className="flow-row" style={{ display: 'grid', gridTemplateColumns: '150px 1fr 200px', gap: '2rem', alignItems: 'center' }}>
            <div className="flow-left"></div>
            <div className="branch-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', width: '100%', maxWidth: '850px', margin: '0 auto' }}>
              
              {/* Branch 1 */}
              <div className="branch-card" style={{ background: 'rgba(20, 26, 18, 0.3)', border: '1px solid rgba(173, 255, 79, 0.08)', borderRadius: '12px', padding: '1.25rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 900, background: 'rgba(173, 255, 79, 0.08)', color: 'var(--accent)', border: '1px solid rgba(173, 255, 79, 0.12)', padding: '2px 8px', borderRadius: '20px' }}>
                    Update 1-2
                  </span>
                  <Layers size={14} style={{ color: 'var(--accent)', opacity: 0.6 }} />
                </div>
                <h4 className="font-syne" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>Early foundations</h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.78rem', lineHeight: 1.4, margin: 0 }}>screenshots + notes</p>
              </div>

              {/* Branch 2 */}
              <div className="branch-card" style={{ background: 'rgba(20, 26, 18, 0.3)', border: '1px solid rgba(173, 255, 79, 0.08)', borderRadius: '12px', padding: '1.25rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 900, background: 'rgba(173, 255, 79, 0.08)', color: 'var(--accent)', border: '1px solid rgba(173, 255, 79, 0.12)', padding: '2px 8px', borderRadius: '20px' }}>
                    Update 3
                  </span>
                  <Video size={14} style={{ color: 'var(--accent)', opacity: 0.6 }} />
                </div>
                <h4 className="font-syne" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>Mid-build review</h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.78rem', lineHeight: 1.4, margin: 0 }}>video clip - buyer can comment</p>
              </div>

              {/* Branch 3 */}
              <div className="branch-card" style={{ background: 'rgba(20, 26, 18, 0.3)', border: '1px solid rgba(173, 255, 79, 0.08)', borderRadius: '12px', padding: '1.25rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 900, background: 'rgba(173, 255, 79, 0.08)', color: 'var(--accent)', border: '1px solid rgba(173, 255, 79, 0.12)', padding: '2px 8px', borderRadius: '20px' }}>
                    Update 4-5
                  </span>
                  <CheckCircle2 size={14} style={{ color: 'var(--accent)', opacity: 0.6 }} />
                </div>
                <h4 className="font-syne" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>Near-complete build</h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.78rem', lineHeight: 1.4, margin: 0 }}>approval requested</p>
              </div>

            </div>
            <div className="flow-right"></div>
          </div>

          {/* Arrow */}
          <div className="flow-arrow-row" style={{ display: 'flex', justifyContent: 'center', margin: '-0.5rem 0' }}>
            <ArrowDown style={{ color: 'rgba(242, 204, 143, 0.4)' }} size={24} />
          </div>

          {/* STEP 04 */}
          <div className="flow-row" style={{ display: 'grid', gridTemplateColumns: '150px 1fr 200px', gap: '2rem', alignItems: 'center' }}>
            <div className="flow-left" style={{ textTransform: 'uppercase', fontFamily: 'var(--font-syncopate)', fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent)', opacity: 0.6 }}>
              Ship
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <div className="flow-card" style={{ width: '100%', maxWidth: '520px', background: 'rgba(20, 26, 18, 0.45)', backdropFilter: 'blur(16px)', border: '1px solid rgba(173, 255, 79, 0.12)', borderRadius: '16px', padding: '1.5rem 2rem', position: 'relative' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(242, 204, 143, 0.15)', border: '1px solid rgba(242, 204, 143, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F2CC8F' }}>
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <h3 className="font-syne" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>04 — Remaining 50% payment</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '4px 0 0', lineHeight: 1.4 }}>Buyer pays balance - confirmed before files</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flow-right" style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: 'rgba(242, 204, 143, 0.12)', border: '1px solid rgba(242, 204, 143, 0.25)', color: '#F2CC8F', padding: '6px 16px', borderRadius: '30px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em' }}>
                PAYMENT
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flow-arrow-row" style={{ display: 'flex', justifyContent: 'center', margin: '-0.5rem 0' }}>
            <ArrowDown style={{ color: 'rgba(242, 204, 143, 0.4)' }} size={24} />
          </div>

          {/* STEP 05 */}
          <div className="flow-row" style={{ display: 'grid', gridTemplateColumns: '150px 1fr 200px', gap: '2rem', alignItems: 'center' }}>
            <div className="flow-left" style={{ textTransform: 'uppercase', fontFamily: 'var(--font-syncopate)', fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent)', opacity: 0.6 }}>
              {/* Aligned with ship */}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <div className="flow-card" style={{ width: '100%', maxWidth: '520px', background: 'rgba(20, 26, 18, 0.45)', backdropFilter: 'blur(16px)', border: '1px solid rgba(173, 255, 79, 0.12)', borderRadius: '16px', padding: '1.5rem 2rem', position: 'relative' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(242, 204, 143, 0.15)', border: '1px solid rgba(242, 204, 143, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F2CC8F' }}>
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="font-syne" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>05 — Final delivery</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '4px 0 0', lineHeight: 1.4 }}>Polished build - images - buyer approval</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flow-right" style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: 'rgba(173, 255, 79, 0.08)', border: '1px solid rgba(173, 255, 79, 0.25)', color: 'var(--accent)', padding: '6px 16px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800, lineHeight: 1.3, maxWidth: '160px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ChevronRight size={14} style={{ flexShrink: 0 }} />
                <span>Source files .rbxl - .spt etc. .ZIP</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flow-arrow-row" style={{ display: 'flex', justifyContent: 'center', margin: '-0.5rem 0' }}>
            <ArrowDown style={{ color: 'rgba(129, 178, 154, 0.4)' }} size={24} />
          </div>

          {/* STEP 06 */}
          <div className="flow-row" style={{ display: 'grid', gridTemplateColumns: '150px 1fr 200px', gap: '2rem', alignItems: 'center' }}>
            <div className="flow-left" style={{ textTransform: 'uppercase', fontFamily: 'var(--font-syncopate)', fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent)', opacity: 0.6 }}>
              Close
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <div className="flow-card" style={{ width: '100%', maxWidth: '520px', background: 'linear-gradient(135deg, rgba(129, 178, 154, 0.2), rgba(20, 26, 18, 0.45))', backdropFilter: 'blur(16px)', border: '1px solid rgba(129, 178, 154, 0.35)', borderRadius: '16px', padding: '1.5rem 2rem', position: 'relative', boxShadow: 'var(--glow-gold2)' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(129, 178, 154, 0.25)', border: '1px solid rgba(129, 178, 154, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#81B29A' }}>
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="font-syne" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>06 — Payment & close</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '4px 0 0', lineHeight: 1.4 }}>Final 50% - star rating - testimonial</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flow-right" style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: 'rgba(129, 178, 154, 0.15)', border: '1px solid rgba(129, 178, 154, 0.3)', color: '#81B29A', padding: '6px 16px', borderRadius: '30px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em' }}>
                DONE
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── RESPONSIVE MOBILE FLOW STYLING ── */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .flow-row {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
            padding: 0 1rem;
          }
          .flow-left {
            display: inline-block !important;
            margin-bottom: 0.25rem !important;
            font-size: 0.7rem !important;
          }
          .flow-right {
            justify-content: flex-start !important;
            margin-top: 0.5rem !important;
            padding-left: 0.5rem !important;
          }
          .branch-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
            padding: 0 1rem !important;
          }
          .hidden-mobile {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
