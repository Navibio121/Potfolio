'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, Image as ImageIcon, UserCircle, CreditCard, Settings, LogOut, Tags, HelpCircle } from 'lucide-react';

// Import our manager components (we'll create these next)
import PortfolioManager from '@/components/admin/PortfolioManager';
import ProfileManager from '@/components/admin/ProfileManager';
import PaymentManager from '@/components/admin/PaymentManager';
import PricingManager from '@/components/admin/PricingManager';

const TABS = [
  { id: 'portfolio', label: 'Portfolio', icon: ImageIcon },
  { id: 'profile', label: 'Profile Settings', icon: UserCircle },
  { id: 'payments', label: 'Payment Gateways', icon: CreditCard },
  { id: 'pricing', label: 'Pricing Tiers', icon: Tags },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const localAdmin = localStorage.getItem('isAdmin') === 'true';
      if (!session && !localAdmin) {
        router.push('/admin-gateway');
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('isAdmin');
    router.push('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'portfolio': return <PortfolioManager />;
      case 'profile': return <ProfileManager />;
      case 'payments': return <PaymentManager />;
      case 'pricing': return <PricingManager />;
      default: return <PortfolioManager />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: '#050508', color: '#fff' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '280px', 
        background: '#0a0a0e', 
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '2rem' }}>
          <h1 className="font-bebas" style={{ fontSize: '2rem', color: 'var(--accent)', margin: 0, letterSpacing: '0.05em' }}>
            VISIONARY<span style={{ color: '#fff' }}>PORT</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Admin Dashboard</p>
        </div>

        <nav style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '12px',
                background: activeTab === tab.id ? 'rgba(var(--accent-rgb), 0.15)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent)' : 'rgba(255,255,255,0.6)',
                border: '1px solid',
                borderColor: activeTab === tab.id ? 'rgba(var(--accent-rgb), 0.25)' : 'transparent',
                cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600,
                transition: 'all 0.2s ease', textAlign: 'left'
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '2rem 1rem' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
              padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)',
              color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '1rem'
            }}
          >
            <LayoutDashboard size={16} /> View Live Site
          </button>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
              padding: '12px 16px', borderRadius: '12px', background: 'transparent',
              color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '0.9rem'
            }}
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '3rem 4rem', overflowY: 'auto', background: 'radial-gradient(circle at top right, rgba(var(--accent-rgb), 0.15) 0%, transparent 50%)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
