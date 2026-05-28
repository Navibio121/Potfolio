'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Testimonials({ isAdmin = false }: { isAdmin?: boolean }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newReview, setNewReview] = useState({ client_name: '', role: '', feedback: '', rating: 5 });
  const [isSaving, setIsSaving] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play testimonial slider
  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [reviews]);

  useEffect(() => {
    async function loadTestimonials() {
      const { data } = await supabase.from('client_testimonials').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setReviews(data);
      } else {
        // Fallback to empty state
        setReviews([]);
      }
    }
    loadTestimonials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    const { error } = await supabase.from('client_testimonials').delete().eq('id', id);
    if (error) alert(error.message);
    else setReviews(reviews.filter(r => r.id !== id));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const { data, error } = await supabase.from('client_testimonials').insert([newReview]).select();
    if (error) alert(error.message);
    else if (data) {
      setReviews([data[0], ...reviews]);
      setIsAdding(false);
      setNewReview({ client_name: '', role: '', feedback: '', rating: 5 });
    }
    setIsSaving(false);
  };

  return (
    <motion.section
      className="bg-option-3"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
      style={{
        position: 'relative',
        padding: '8rem 0',
        overflow: 'hidden',
        clipPath: 'polygon(0 5%, 100% 0, 100% 95%, 0 100%)',
        zIndex: 5,
      }}
    >

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 5%', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p className="sec-label" style={{ color: 'var(--accent)', marginBottom: '1rem' }}>
            — Client Feedback
          </p>
          <h2 className="font-syncopate" style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: 'var(--fg)', margin: 0,
            textTransform: 'uppercase',
          }}>
            Reputation
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={() => {
                if (!isAdmin) {
                  alert('Admin Mode Required.');
                  return;
                }
                setIsAdding(true);
              }}
              style={{ 
                marginTop: '1.5rem', padding: '10px 20px', borderRadius: '8px', 
                background: isAdmin ? 'var(--accent)15' : 'transparent', 
                border: isAdmin ? '1px solid var(--accent)' : '1px dashed var(--card-border)', 
                color: isAdmin ? 'var(--accent)' : 'var(--muted)', 
                fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' 
              }}
            >
              Add Testimonial
              {!isAdmin && <span style={{ fontSize: '0.65rem', background: 'var(--accent)22', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px' }}>LOCKED</span>}
            </button>
          </div>
        </div>

        {/* Add Modal */}
        {isAdding && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '500px' }}>
              <h3 className="font-bebas" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Add Testimonial</h3>
              <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input required placeholder="Client Name" value={newReview.client_name} onChange={e => setNewReview({...newReview, client_name: e.target.value})} style={inputStyle} />
                <input required placeholder="Client Role" value={newReview.role} onChange={e => setNewReview({...newReview, role: e.target.value})} style={inputStyle} />
                <textarea required placeholder="Feedback content..." value={newReview.feedback} onChange={e => setNewReview({...newReview, feedback: e.target.value})} style={{...inputStyle, height: '100px', resize: 'none'}} />
                <button disabled={isSaving} type="submit" style={{ padding: '12px', borderRadius: '8px', background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                  {isSaving ? 'Saving...' : 'Add Testimonial'}
                </button>
                <button type="button" onClick={() => setIsAdding(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        {/* Testimonial Slider Wrapper */}
        <div style={{ position: 'relative', width: '100%', padding: '0 2rem' }}>
          <div style={{ position: 'relative', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
              {reviews[currentIndex] && (
                <motion.div
                  key={reviews[currentIndex].id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    width: '100%',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    padding: '3rem 2.5rem',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  <Quote size={50} color="var(--accent)" style={{ opacity: 0.15, position: 'absolute', top: '2.5rem', right: '2.5rem' }} />
                  
                  {isAdmin && (
                    <button 
                      onClick={() => handleDelete(reviews[currentIndex].id)}
                      style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef444455', color: '#ef4444', padding: '8px', borderRadius: '8px', cursor: 'pointer', zIndex: 10 }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
                    {[...Array(reviews[currentIndex].rating || 5)].map((_, j) => (
                      <Star key={j} size={16} fill="var(--accent)" color="var(--accent)" />
                    ))}
                  </div>

                  <p style={{
                    color: 'var(--fg)', fontSize: '1.2rem', lineHeight: 1.8,
                    fontFamily: 'var(--font-inter)', fontWeight: 300,
                    marginBottom: '2.5rem',
                    fontStyle: 'italic'
                  }}>
                    "{reviews[currentIndex].feedback}"
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    {reviews[currentIndex].image_url ? (
                      <img src={reviews[currentIndex].image_url} alt={reviews[currentIndex].client_name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
                    ) : (
                      <div style={{
                        width: '56px', height: '56px', borderRadius: '50%',
                        background: 'rgba(var(--accent-rgb), 0.1)', border: '2px solid var(--accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)',
                        fontFamily: 'var(--font-bebas)',
                      }}>
                        {reviews[currentIndex].client_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-syne" style={{ margin: 0, color: 'var(--fg)', fontWeight: 800, fontSize: '1.2rem' }}>
                        {reviews[currentIndex].client_name}
                      </p>
                      <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '0.85rem', fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
                        {reviews[currentIndex].role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          {reviews.length > 1 && (
            <>
              <button 
                onClick={() => setCurrentIndex(prev => (prev - 1 + reviews.length) % reviews.length)}
                style={navBtnStyle({ left: '-30px' })}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--accent)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--card-border)';
                  e.currentTarget.style.color = 'var(--fg)';
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setCurrentIndex(prev => (prev + 1) % reviews.length)}
                style={navBtnStyle({ right: '-30px' })}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--accent)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--card-border)';
                  e.currentTarget.style.color = 'var(--fg)';
                }}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Navigation Dots */}
          {reviews.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '2.5rem' }}>
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: idx === currentIndex ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: idx === currentIndex ? 'scale(1.2)' : 'scale(1)',
                    boxShadow: idx === currentIndex ? '0 0 10px var(--accent)' : 'none',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

const navBtnStyle = (pos: React.CSSProperties): React.CSSProperties => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,
  background: 'rgba(20, 26, 18, 0.8)',
  border: '1px solid var(--card-border)',
  color: 'var(--fg)',
  borderRadius: '50%',
  width: '46px',
  height: '46px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  ...pos,
});

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--card-border)', color: 'var(--fg)', fontSize: '0.9rem', outline: 'none'
};
