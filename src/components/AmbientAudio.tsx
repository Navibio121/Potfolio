'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Disc, Volume2, VolumeX } from 'lucide-react';

export default function AmbientAudio() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // We use a royalty-free ambient track
    audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/05/16/audio_95fa721669.mp3?filename=lofi-study-112191.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // keep it ambient

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    setPlaying(!playing);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5 }} // animate in after loading screen
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      <button
        onClick={togglePlay}
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid var(--card-border)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--fg)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease',
        }}
        onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent)'}
        onMouseOut={e => e.currentTarget.style.borderColor = 'var(--card-border)'}
      >
        {playing ? <Volume2 size={18} color="var(--accent)" /> : <VolumeX size={18} />}
      </button>

      <div style={{
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--card-border)',
        padding: '6px 14px',
        borderRadius: '999px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        opacity: playing ? 1 : 0.4,
        transition: 'opacity 0.3s ease',
      }}>
        <motion.div
          animate={{ rotate: playing ? 360 : 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex' }}
        >
          <Disc size={14} color={playing ? 'var(--accent)' : 'var(--muted)'} />
        </motion.div>
        <span style={{ 
          fontSize: '0.75rem', 
          color: playing ? 'var(--fg)' : 'var(--muted)',
          fontFamily: 'var(--font-inter)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {playing ? 'Lofi Ambient' : 'Music Paused'}
        </span>
      </div>
    </motion.div>
  );
}
