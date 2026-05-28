'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, X, Loader2, DollarSign, Check, Edit3 } from 'lucide-react';

interface PricingTier {
  name: string;
  price: string;
  desc: string;
  color: string;
  popular?: boolean;
  features: string[];
}

export default function PricingManager() {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadPricing() {
      const { data, error } = await supabase.from('artist_settings').select('pricing_tiers').eq('id', 1).single();
      if (data && data.pricing_tiers) {
        setTiers(data.pricing_tiers);
      } else {
        // Default tiers if none found
        setTiers([
          {
            name: 'Standard Asset',
            price: '$150+',
            desc: 'Perfect for low-poly props, UI elements, and basic game assets.',
            color: '#38bdf8',
            features: ['1 Game-ready Model', '2K Textures', '1 Revision', '3-5 days'],
          },
          {
            name: 'Premium Asset',
            price: '$450+',
            desc: 'High-fidelity models, complex scripts, or advanced GUI animations.',
            color: 'var(--accent)',
            popular: true,
            features: ['High-poly / Complex Logic', '4K Textures', 'Rigged & Animated', '3 Revisions'],
          },
          {
            name: 'Full Scene / Map',
            price: '$1,200+',
            desc: 'Complete environments, massive map builds, or full framework systems.',
            color: '#fbbf24',
            features: ['Massive Scale Production', 'Full Lighting', 'Source Files', 'Unlimited Revisions'],
          }
        ]);
      }
      setLoading(false);
    }
    loadPricing();
  }, []);

  const saveTiers = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('artist_settings')
      .update({ pricing_tiers: tiers })
      .eq('id', 1);

    if (error) {
      alert('Error saving pricing: ' + error.message);
    } else {
      alert('Pricing updated successfully!');
    }
    setSaving(false);
  };

  const updateTier = (index: number, field: keyof PricingTier, value: any) => {
    const next = [...tiers];
    (next[index] as any)[field] = value;
    setTiers(next);
  };

  const addFeature = (index: number) => {
    const next = [...tiers];
    next[index].features.push('New Feature');
    setTiers(next);
  };

  const removeFeature = (tierIndex: number, featIndex: number) => {
    const next = [...tiers];
    next[tierIndex].features.splice(featIndex, 1);
    setTiers(next);
  };

  const updateFeature = (tierIndex: number, featIndex: number, value: string) => {
    const next = [...tiers];
    next[tierIndex].features[featIndex] = value;
    setTiers(next);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>
        <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto' }} />
        <p style={{ marginTop: '1rem' }}>Loading pricing...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#fff' }}>Pricing Tiers</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>Manage your commission packages and rates.</p>
        </div>
        <button
          onClick={saveTiers}
          disabled={saving}
          style={{
            padding: '12px 24px', borderRadius: '12px', background: 'var(--accent)', color: '#080808',
            border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 20px rgba(var(--accent-rgb), 0.15)',
          }}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save All Pricing</>}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {tiers.map((tier, i) => (
          <div
            key={i}
            style={{
              background: '#0f0f13',
              border: `1px solid ${tier.popular ? tier.color : 'rgba(255,255,255,0.06)'}`,
              borderRadius: '24px',
              padding: '2rem',
              position: 'relative',
            }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <input
                  value={tier.name}
                  onChange={e => updateTier(i, 'name', e.target.value)}
                  style={{ ...inputStyle, fontSize: '1.2rem', fontWeight: 800, flex: 1, marginRight: '10px' }}
                />
                <input
                  type="color"
                  value={tier.color}
                  onChange={e => updateTier(i, 'color', e.target.value)}
                  style={{ width: '32px', height: '32px', border: 'none', borderRadius: '4px', background: 'none', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <DollarSign size={18} color="rgba(255,255,255,0.3)" />
                <input
                  value={tier.price}
                  onChange={e => updateTier(i, 'price', e.target.value)}
                  style={{ ...inputStyle, width: '120px', color: tier.color, fontWeight: 700 }}
                  placeholder="Price (e.g. $150+)"
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={tier.popular}
                    onChange={e => updateTier(i, 'popular', e.target.checked)}
                  />
                  Most Popular?
                </label>
              </div>

              <textarea
                value={tier.desc}
                onChange={e => updateTier(i, 'desc', e.target.value)}
                style={{ ...inputStyle, height: '60px', resize: 'none', fontSize: '0.85rem' }}
                placeholder="Tier description..."
              />
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Features</h4>
                <button
                  onClick={() => addFeature(i)}
                  style={{ background: 'none', border: 'none', color: tier.color, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700 }}
                >
                  <Plus size={14} /> Add Feature
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tier.features.map((feat, fi) => (
                  <div key={fi} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      value={feat}
                      onChange={e => updateFeature(i, fi, e.target.value)}
                      style={{ ...inputStyle, padding: '8px 12px', fontSize: '0.85rem' }}
                    />
                    <button
                      onClick={() => removeFeature(i, fi)}
                      style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '10px',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  color: '#fff', fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s ease',
};
