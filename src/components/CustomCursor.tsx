'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        getComputedStyle(target).cursor === 'pointer'
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '10px', height: '10px',
          backgroundColor: 'var(--accent)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      <motion.div
        animate={{
          width: hovered ? 48 : 24,
          height: hovered ? 48 : 24,
          backgroundColor: hovered ? 'rgba(var(--accent-rgb), 0.15)' : 'rgba(var(--accent-rgb), 0.05)',
          border: hovered ? '1px solid var(--accent)' : '1px solid rgba(var(--accent-rgb), 0.15)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          backdropFilter: hovered ? 'blur(2px)' : 'none',
        }}
      />
    </>
  );
}
