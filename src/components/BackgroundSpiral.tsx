'use client';

import React from 'react';

export default function BackgroundSpiral({ 
  size = 600, 
  color = 'var(--accent)', 
  speed = 0.9,
  opacity = 0.1,
  className = '',
  style = {}
}: { 
  size?: number | string; 
  color?: string; 
  speed?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const containerStyle = {
    '--uib-size': typeof size === 'number' ? `${size}px` : size,
    '--uib-color': color,
    '--uib-speed': `${speed}s`,
    '--uib-center': `calc(var(--uib-size) / 2 - var(--uib-size) / 5 / 2)`,
    opacity: opacity,
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 0,
    ...style
  } as React.CSSProperties;

  return (
    <div className={`spiral-bg-container ${className}`} style={containerStyle}>
      <div className="spiral-bg-dot"></div>
      <div className="spiral-bg-dot"></div>
      <div className="spiral-bg-dot"></div>
      <div className="spiral-bg-dot"></div>
      <div className="spiral-bg-dot"></div>
      <div className="spiral-bg-dot"></div>
      <div className="spiral-bg-dot"></div>
      <div className="spiral-bg-dot"></div>
      <style>{`
        .spiral-bg-container {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: var(--uib-size);
          width: var(--uib-size);
          animation: spiral-bg-rotate calc(var(--uib-speed) * 3) linear infinite;
        }

        .spiral-bg-dot {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: 100%;
          width: 100%;
        }

        .spiral-bg-dot::before {
          content: '';
          height: 20%;
          width: 20%;
          border-radius: 50%;
          background-color: var(--uib-color);
          animation: spiral-bg-oscillate var(--uib-speed) ease-in-out infinite alternate;
          transition: background-color 0.3s ease;
        }

        .spiral-bg-dot:nth-child(1)::before { transform: translateX(var(--uib-center)); }
        
        .spiral-bg-dot:nth-child(2) { transform: rotate(45deg); }
        .spiral-bg-dot:nth-child(2)::before {
          transform: translateX(var(--uib-center));
          animation-delay: calc(var(--uib-speed) * -0.125);
        }

        .spiral-bg-dot:nth-child(3) { transform: rotate(90deg); }
        .spiral-bg-dot:nth-child(3)::before {
          transform: translateX(var(--uib-center));
          animation-delay: calc(var(--uib-speed) * -0.25);
        }

        .spiral-bg-dot:nth-child(4) { transform: rotate(135deg); }
        .spiral-bg-dot:nth-child(4)::before {
          transform: translateX(var(--uib-center));
          animation-delay: calc(var(--uib-speed) * -0.375);
        }

        .spiral-bg-dot:nth-child(5) { transform: rotate(180deg); }
        .spiral-bg-dot:nth-child(5)::before {
          transform: translateX(var(--uib-center));
          animation-delay: calc(var(--uib-speed) * -0.5);
        }

        .spiral-bg-dot:nth-child(6) { transform: rotate(225deg); }
        .spiral-bg-dot:nth-child(6)::before {
          transform: translateX(var(--uib-center));
          animation-delay: calc(var(--uib-speed) * -0.625);
        }

        .spiral-bg-dot:nth-child(7) { transform: rotate(270deg); }
        .spiral-bg-dot:nth-child(7)::before {
          transform: translateX(var(--uib-center));
          animation-delay: calc(var(--uib-speed) * -0.75);
        }

        .spiral-bg-dot:nth-child(8) { transform: rotate(315deg); }
        .spiral-bg-dot:nth-child(8)::before {
          transform: translateX(var(--uib-center));
          animation-delay: calc(var(--uib-speed) * -0.875);
        }

        @keyframes spiral-bg-oscillate {
          0% {
            transform: translateX(var(--uib-center)) scale(0);
            opacity: 0.25;
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes spiral-bg-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
