'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Play, Maximize2, X } from 'lucide-react';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumb?: string;
  title: string;
  description?: string;
  likes: number;
}

function Lightbox({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
        backdropFilter: 'blur(8px)',
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem',
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%', width: '44px', height: '44px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#fff',
        }}
      >
        <X size={20} />
      </button>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '85vh', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        {item.type === 'image' ? (
          <img
            src={item.url}
            alt={item.title}
            style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '12px' }}
          />
        ) : (
          <video
            src={item.url}
            controls
            autoPlay
            style={{ maxWidth: '100%', maxHeight: '75vh', borderRadius: '12px' }}
          />
        )}
        <div>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '1.3rem', fontWeight: 700 }}>{item.title}</h3>
          {item.description && (
            <p style={{ margin: '0.5rem 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>{item.description}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MediaCard({ item }: { item: MediaItem }) {
  const [likes, setLikes] = useState(item.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(v => !v);
    setLikes(v => isLiked ? v - 1 : v + 1);
  };

  return (
    <>
      {lightboxOpen && <Lightbox item={item} onClose={() => setLightboxOpen(false)} />}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setLightboxOpen(true)}
        style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          cursor: 'pointer',
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          aspectRatio: '4/5',
          boxShadow: isHovered ? '0 25px 50px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.15)',
          transition: 'box-shadow 0.3s ease, transform 0.3s ease',
          transform: isHovered ? 'translateY(-6px)' : 'none',
        }}
      >
        {/* Media */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {item.type === 'image' ? (
            <img
              src={item.url}
              alt={item.title}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.6s ease',
                transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              }}
            />
          ) : (
            <>
              {item.thumb ? (
                <img
                  src={item.thumb}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Play size={48} style={{ color: 'rgba(255,255,255,0.5)' }} />
                </div>
              )}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.3)',
              }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}>
                  <Play size={22} style={{ color: '#fff', marginLeft: '3px' }} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Hover overlay with info */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '1.25rem',
          opacity: isHovered ? 1 : 0.7,
          transition: 'opacity 0.3s ease',
        }}>
          <h3 style={{
            margin: 0, color: '#fff',
            fontSize: '1rem', fontWeight: 700,
            transform: isHovered ? 'translateY(0)' : 'translateY(4px)',
            transition: 'transform 0.3s ease',
          }}>
            {item.title}
          </h3>
          {item.description && (
            <p style={{
              margin: '0.35rem 0 0.75rem',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.8rem',
              display: isHovered ? 'block' : 'none',
              lineHeight: 1.5,
            }}>
              {item.description}
            </p>
          )}

          {/* Actions */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: '0.5rem',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.3s ease 0.05s',
          }}>
            <button
              onClick={handleLike}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '999px',
                background: isLiked ? '#ef4444' : 'rgba(255,255,255,0.12)',
                border: '1px solid ' + (isLiked ? '#ef4444' : 'rgba(255,255,255,0.2)'),
                color: '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
              }}
            >
              <Heart size={15} fill={isLiked ? '#fff' : 'none'} />
              {likes}
            </button>

            <button
              onClick={e => { e.stopPropagation(); setLightboxOpen(true); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', cursor: 'pointer',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Maximize2 size={15} />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
