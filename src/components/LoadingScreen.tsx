'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200); // 2.2 seconds loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            background: 'var(--bg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Logo Animation */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="font-bebas"
              style={{
                fontSize: '4.5rem',
                color: 'var(--fg)',
                letterSpacing: '0.1em',
                zIndex: 2,
              }}
            >
              VISIONARY<span style={{ color: 'var(--accent)' }}>PORT</span>
            </motion.div>

            {/* Glowing Orb Behind Logo */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.15 }}
              transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: '300px', height: '300px',
                borderRadius: '50%',
                background: 'var(--accent)',
                filter: 'blur(60px)',
                zIndex: 1,
              }}
            />
          </div>

          {/* Loading Bar */}
          <div style={{ marginTop: '2rem', width: '200px', height: '2px', background: 'var(--card-border)', borderRadius: '999px', overflow: 'hidden' }}>
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              style={{ width: '100%', height: '100%', background: 'var(--accent)' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
