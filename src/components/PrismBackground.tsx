'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PrismBackground() {
  return (
    <div className="fluid-bg">
      {/* Iridescent Blobs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="blob"
        style={{
          top: '10%', left: '10%',
          width: '40vw', height: '40vw',
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
        }}
      />
      <motion.div
        animate={{
          x: [0, -150, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="blob"
        style={{
          bottom: '10%', right: '5%',
          width: '50vw', height: '50vw',
          background: 'radial-gradient(circle, var(--accent-cyan) 0%, transparent 70%)',
        }}
      />
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 150, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="blob"
        style={{
          top: '40%', right: '20%',
          width: '35vw', height: '35vw',
          background: 'radial-gradient(circle, var(--accent-peach) 0%, transparent 70%)',
        }}
      />
      
      {/* Grain / Noise Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: 0.03, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  );
}
