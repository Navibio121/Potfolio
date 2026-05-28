'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Check, Plus, Trash2, Save, X, Loader2, CreditCard } from 'lucide-react';

const PAYMENT_METHODS_OPTIONS = [
  { id: 'paypal', name: 'PayPal', icon: '🅿️', color: '#003087', desc: 'Send via PayPal.me link' },
  { id: 'cashapp', name: 'Cash App', icon: '💸', color: '#00d54b', desc: 'Send via $cashtag' },
  { id: 'crypto', name: 'Crypto', icon: '₿', color: '#f7931a', desc: 'BTC, ETH, USDT, SOL' },
  { id: 'skrill', name: 'Skrill', icon: '🟣', color: '#862165', desc: 'Instant digital wallet' },
  { id: 'giftcard', name: 'Gift Card', icon: '🎁', color: '#e91e63', desc: 'Amazon, Steam, iTunes…' },
  { id: 'bank', name: 'Bank Transfer', icon: '🏦', color: '#1565c0', desc: 'SWIFT / SEPA / Wire' },
];

export default function PaymentManager() {
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase.from('artist_settings').select('payment_methods').eq('id', 1).single();
      if (data && data.payment_methods) {
        setSelectedMethods(data.payment_methods);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const toggleMethod = (id: string) => {
    setSelectedMethods(prev => {
      const next = prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id];
      return next;
    });
  };

  const saveChanges = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('artist_settings')
      .update({ payment_methods: selectedMethods })
      .eq('id', 1);

    if (error) {
      alert('Error saving payments: ' + error.message);
    } else {
      alert('Payment methods updated successfully!');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>
        <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto' }} />
        <p style={{ marginTop: '1rem' }}>Loading payment settings...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#fff' }}>Payment Gateways</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>Select which payment methods you accept from clients.</p>
        </div>
        <button
          onClick={saveChanges}
          disabled={saving}
          style={{
            padding: '12px 24px', borderRadius: '12px', background: 'var(--accent)', color: '#080808',
            border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 20px rgba(var(--accent-rgb), 0.15)',
          }}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Settings</>}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
        {PAYMENT_METHODS_OPTIONS.map((method) => {
          const isSelected = selectedMethods.includes(method.id);
          return (
            <motion.div
              key={method.id}
              onClick={() => toggleMethod(method.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: isSelected ? 'rgba(var(--accent-rgb), 0.08)' : '#0f0f13',
                border: isSelected ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                padding: '1.5rem',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>{method.icon}</div>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  border: '2px solid',
                  borderColor: isSelected ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                  background: isSelected ? 'var(--accent)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}>
                  {isSelected && <Check size={14} color="#fff" strokeWidth={3} />}
                </div>
              </div>
              <h3 style={{ margin: '0 0 4px', color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>{method.name}</h3>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{method.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
