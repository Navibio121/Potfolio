'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PAYMENT_METHODS = [
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '🅿️',
    color: '#003087',
    accent: '#009cde',
    desc: 'Send via PayPal.me link',
  },
  {
    id: 'cashapp',
    name: 'Cash App',
    icon: '💸',
    color: '#00d54b',
    accent: '#00d54b',
    desc: 'Send via $cashtag',
  },
  {
    id: 'crypto',
    name: 'Crypto',
    icon: '₿',
    color: '#f7931a',
    accent: '#f7931a',
    desc: 'BTC, ETH, USDT, SOL',
  },
  {
    id: 'skrill',
    name: 'Skrill',
    icon: '🟣',
    color: '#862165',
    accent: '#9c27b0',
    desc: 'Instant digital wallet',
  },
  {
    id: 'giftcard',
    name: 'Gift Card',
    icon: '🎁',
    color: '#e91e63',
    accent: '#e91e63',
    desc: 'Amazon, Steam, iTunes…',
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: '🏦',
    color: '#1565c0',
    accent: '#42a5f5',
    desc: 'SWIFT / SEPA / Wire',
  },
];

interface PaymentSectionProps {
  /** For display only — artist's selected payment methods */
  selectedMethods?: string[];
  /** If true, shows checkboxes so artist can select (edit mode) */
  editable?: boolean;
}

export default function PaymentSection({
  selectedMethods = ['paypal', 'cashapp', 'crypto'],
  isAdmin = false,
}: PaymentSectionProps & { isAdmin?: boolean }) {
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedMethods));
  const [isEditing, setIsEditing] = useState(false);

  const editable = isAdmin && isEditing;

  const toggle = (id: string) => {
    if (!editable) return;
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const active = editable
    ? PAYMENT_METHODS
    : PAYMENT_METHODS.filter(m => selected.has(m.id));

  return (
    <section id="payments" style={{
      padding: '5rem 5%',
      background: 'var(--sec-payment)',
      borderTop: '1px solid var(--card-border)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '3rem' }}
        >
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.78rem', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--muted)', marginBottom: '0.75rem',
          }}>
            — Payment Methods
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <h2
              className="font-syne"
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                fontWeight: 800, color: 'var(--fg)',
                letterSpacing: '-0.02em',
                margin: 0
              }}
            >
              {editable ? 'Choose accepted payments' : 'Accepted Payment Methods'}
            </h2>
            <button 
              onClick={() => {
                if (!isAdmin) {
                  alert('Admin Mode Required.');
                  return;
                }
                setIsEditing(!isEditing);
              }}
              style={{ 
                padding: '8px 16px', borderRadius: '8px', 
                background: isEditing ? 'var(--fg)' : 'var(--card-bg)', 
                color: isEditing ? 'var(--bg)' : (isAdmin ? 'var(--fg)' : 'var(--muted)'), 
                border: isAdmin ? '1px solid var(--card-border)' : '1px dashed var(--card-border)', 
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '8px',
                opacity: isAdmin ? 1 : 0.7
              }}
            >
              {isEditing ? 'Done' : 'Edit Payments'}
              {!isAdmin && <span style={{ fontSize: '0.65rem', background: 'var(--accent)22', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px' }}>LOCKED</span>}
            </button>
          </div>
          {!editable && (
            <p style={{
              marginTop: '0.75rem', color: 'var(--muted)',
              fontFamily: 'var(--font-inter)', fontSize: '0.95rem',
            }}>
              This artist accepts the following payment options.
            </p>
          )}
        </motion.div>

        {/* Grid of payment cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem',
        }}>
          {active.map((method, i) => {
            const isActive = selected.has(method.id);
            return (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                onClick={() => toggle(method.id)}
                style={{
                  padding: '1.5rem 1.25rem',
                  borderRadius: '16px',
                  border: `1.5px solid ${isActive && editable ? method.accent + '66' : 'var(--card-border)'}`,
                  background: isActive && editable
                    ? `linear-gradient(135deg, ${method.accent}12, ${method.accent}06)`
                    : 'var(--bg)',
                  cursor: editable ? 'pointer' : 'default',
                  position: 'relative',
                  transition: 'all 0.25s ease',
                  boxShadow: isActive && editable ? `0 4px 24px ${method.accent}22` : 'none',
                }}
              >
                {/* Checkmark (edit mode) */}
                {editable && isActive && (
                  <div style={{
                    position: 'absolute', top: '10px', right: '10px',
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: method.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Check size={13} color="#fff" strokeWidth={3} />
                  </div>
                )}

                {/* Icon */}
                <div style={{
                  fontSize: '2rem', marginBottom: '0.75rem',
                  lineHeight: 1,
                }}>
                  {method.icon}
                </div>

                {/* Name */}
                <p
                  className="font-syne"
                  style={{
                    margin: '0 0 4px', fontWeight: 700,
                    fontSize: '1rem', color: 'var(--fg)',
                  }}
                >
                  {method.name}
                </p>

                {/* Desc */}
                <p style={{
                  margin: 0, color: 'var(--muted)',
                  fontSize: '0.78rem', fontFamily: 'var(--font-inter)',
                  lineHeight: 1.4,
                }}>
                  {method.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {editable && (
          <p style={{
            marginTop: '1.25rem', color: 'var(--muted)',
            fontSize: '0.82rem', fontFamily: 'var(--font-inter)',
            textAlign: 'center',
          }}>
            Click to toggle · All selections are optional
          </p>
        )}
      </div>
    </section>
  );
}
