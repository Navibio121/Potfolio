'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Save, Edit3 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const DEFAULT_TIERS = [
  { name:'Starter', price:'$150', desc:'Perfect for small projects and quick turnarounds.', popular:false, features:['1 Game Asset','2 Revisions','Commercial License','3-Day Delivery'] },
  { name:'Standard', price:'$499', desc:'Ideal for medium-scale game environments and full scenes.', popular:true, features:['Full Scene/Environment','5 Revisions','Source Files Included','Priority Support','7-Day Delivery'] },
  { name:'Premium', price:'$1,200+', desc:'End-to-end production pipeline for ambitious projects.', popular:false, features:['Full Production Pipeline','Unlimited Revisions','NDA Available','Dedicated Support','Custom Timeline'] },
];

export default function PricingSection({ isAdmin = false }: { isAdmin?: boolean }) {
  const [tiers, setTiers] = useState<any[]>(DEFAULT_TIERS);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    supabase.from('artist_settings').select('pricing_tiers').eq('id',1).single().then(({ data }) => {
      if (data?.pricing_tiers?.length) setTiers(data.pricing_tiers);
    });
  }, []);

  const save = async () => {
    await supabase.from('artist_settings').update({ pricing_tiers:tiers }).eq('id',1);
    setEditing(false);
  };

  const update = (i: number, field: string, val: any) => {
    const next = [...tiers]; next[i][field]=val; setTiers(next);
  };

  return (
    <section id="pricing" className="bg-option-2" style={{ padding:'7rem 5%' }}>
      <div style={{ maxWidth:'1300px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'5rem' }}>
          <p className="sec-label" style={{ justifyContent:'center' }}>INVESTMENT</p>
          <h2 className="font-bebas" style={{ fontSize:'clamp(2.5rem,6vw,5rem)', color:'#fff', margin:'0 0 1rem', lineHeight:1 }}>
            COMMISSION <span className="gradient-text">TIERS</span>
          </h2>
          <p style={{ color:'var(--muted)', maxWidth:'500px', margin:'0 auto 2rem', lineHeight:1.7 }}>
            Flexible pricing designed to match every level of creative ambition.
          </p>
          {isAdmin && (
            <button onClick={()=>editing?save():setEditing(true)} className={editing?'btn-neon':'btn-outline'} style={{ display:'inline-flex', alignItems:'center', gap:'8px', borderRadius:'10px' }}>
              {editing?<><Save size={16}/>SAVE PRICING</>:<><Edit3 size={16}/>EDIT PRICING</>}
            </button>
          )}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'1.75rem', alignItems:'stretch' }}>
          {tiers.map((tier, i) => (
            <motion.div key={tier.name}
              initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
              style={{
                background: tier.popular
                  ? 'linear-gradient(135deg,rgba(var(--accent-rgb), 0.15),rgba(245,215,142,0.1))'
                  : 'var(--gradient-card)',
                border: `1px solid ${tier.popular?'var(--accent)':'var(--card-border)'}`,
                borderRadius:'20px', padding:'2.5rem 2rem',
                position:'relative', display:'flex', flexDirection:'column',
                boxShadow: tier.popular ? 'var(--glow-cyan)' : 'none',
              }}
            >
              {tier.popular && (
                <span style={{ position:'absolute', top:'-14px', left:'50%', transform:'translateX(-50%)', background:'linear-gradient(90deg,var(--accent),var(--accent2))', color:'#fff', padding:'4px 16px', borderRadius:'50px', fontSize:'0.65rem', fontWeight:900, letterSpacing:'0.15em', whiteSpace:'nowrap' }}>
                  MOST POPULAR
                </span>
              )}

              {editing ? (
                <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'1.5rem' }}>
                  <input value={tier.name} onChange={e=>update(i,'name',e.target.value)} className="cinema-input" />
                  <input value={tier.price} onChange={e=>update(i,'price',e.target.value)} className="cinema-input" style={{ fontSize:'1.5rem', color:'var(--accent)', fontWeight:900 }} />
                  <textarea value={tier.desc} onChange={e=>update(i,'desc',e.target.value)} className="cinema-input" style={{ height:'80px', resize:'none' }} />
                </div>
              ) : (
                <>
                  <p style={{ color:'var(--muted)', fontSize:'0.8rem', fontWeight:800, letterSpacing:'0.15em', marginBottom:'0.75rem' }}>{tier.name.toUpperCase()}</p>
                  <div className="font-bebas" style={{ fontSize:'3.5rem', color:tier.popular?'var(--accent)':'#fff', lineHeight:0.9, marginBottom:'1rem' }}>{tier.price}</div>
                  <p style={{ color:'var(--muted)', fontSize:'0.92rem', lineHeight:1.6, marginBottom:'2rem' }}>{tier.desc}</p>
                </>
              )}

              <ul style={{ listStyle:'none', padding:0, margin:'0 0 2.5rem', display:'flex', flexDirection:'column', gap:'0.9rem', borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'1.5rem' }}>
                {tier.features.map((f:string) => (
                  <li key={f} style={{ display:'flex', alignItems:'center', gap:'10px', color:'rgba(255,255,255,0.8)', fontSize:'0.88rem' }}>
                    <div style={{ width:'18px', height:'18px', borderRadius:'50%', background:'rgba(var(--accent-rgb), 0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Check size={11} color="var(--accent)" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <a href="#contact" className={tier.popular?'btn-neon':'btn-outline'} style={{ marginTop:'auto', justifyContent:'center', borderRadius:'12px', textAlign:'center' }}>
                REQUEST QUOTE <ArrowRight size={16} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
