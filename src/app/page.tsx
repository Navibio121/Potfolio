'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeroSlideshow from '@/components/HeroSlideshow';
import ArtistProfile from '@/components/ArtistProfile';
import TechStackGrid from '@/components/TechStackGrid';
import PortfolioRedesign from '@/components/PortfolioRedesign';
import ProjectProcess from '@/components/ProjectProcess';
import { supabase } from '@/lib/supabase';
import Testimonials from '@/components/Testimonials';
import SocialLinksSection from '@/components/SocialLinksSection';
import PaymentSection from '@/components/PaymentSection';
import BookCallSection from '@/components/BookCallSection';
import FAQSection from '@/components/FAQSection';
import AmbientAudio from '@/components/AmbientAudio';
import ContactSection from '@/components/ContactSection';
import ThemeToggle from '@/components/ThemeToggle';
import LoadingScreen from '@/components/LoadingScreen';
import PricingSection from '@/components/PricingSection';
import OnboardingSection from '@/components/OnboardingSection';

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [projects, setProjects] = useState<any[]>([]);
  const [avatar, setAvatar] = useState<string | undefined>();
  const [socials, setSocials] = useState<any[]>([]);
  const router = useRouter();

  const loadData = React.useCallback(async () => {
    const { data: worksData } = await supabase
      .from('portfolio_works')
      .select('*')
      .order('created_at', { ascending: false });

    if (worksData && worksData.length > 0) {
      const formattedProjects = worksData.map(work => ({
        ...work,
        industry: work.skill_lane || work.industry || 'Game Art',
        image_url: work.url || work.image_url,
        angles: work.angles || []
      }));
      setProjects(formattedProjects);
    } else {
      setProjects([
        { id: 'mock1', title: 'Trench Map (A Battlefield)', type: 'image', category: 'map', industry: 'Environment', url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=2000&auto=format&fit=crop', description: 'The scene is set on World War 1 and I tried to use terrain and realistic textures...', angles: ['1', '2'] },
        { id: 'mock2', title: 'Legoland Roblox', type: 'image', category: 'map', industry: 'Game Art', url: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?q=80&w=2000&auto=format&fit=crop', description: 'The project was to remake the Germany Legoland in Roblox to give a brand identity...', angles: ['1', '2', '3'] },
        { id: 'mock3', title: 'Cloud 11 - A Futuristic City', type: 'image', category: 'model', industry: 'Architecture', url: 'https://images.unsplash.com/photo-1449156001437-3a16b1adca19?q=80&w=2000&auto=format&fit=crop', description: 'Custom models, lights and new texture techniques were adopted for this sci-fi project.', angles: ['1'] }
      ]);
    }

    const { data: settingsData } = await supabase.from('artist_settings').select('*').eq('id', 1).single();
    if (settingsData) {
      setAvatar(settingsData.profile_image);
      setSocials([
        { platformId: 'discord', value: settingsData.discord },
        { platformId: 'twitter', value: settingsData.twitter },
        { platformId: 'instagram', value: settingsData.instagram },
        { platformId: 'artstation', value: settingsData.artstation },
      ].filter(s => s.value));
    }

    // Check for active session or bypass flag
    const { data: { session } } = await supabase.auth.getSession();
    const localAdmin = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(!!session || localAdmin);
  }, []);

  useEffect(() => {
    loadData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    return () => subscription.unsubscribe();
  }, [loadData]);

  const adminTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const toggleAdmin = () => {
    setAdminClickCount(p => {
      const next = p + 1;
      if (next >= 3) {
        router.push('/admin-gateway');
        return 0;
      }
      return next;
    });
    
    if (adminTimeoutRef.current) clearTimeout(adminTimeoutRef.current);
    adminTimeoutRef.current = setTimeout(() => {
      setAdminClickCount(0);
      adminTimeoutRef.current = null;
    }, 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
    router.refresh();
  };

  return (
    <main className="bg-option-1" style={{ minHeight:'100vh', color:'var(--fg)', position:'relative', overflow:'hidden' }}>
      <div className="noise-overlay" />
      <div style={{ position:'relative', zIndex:1 }}>
      <LoadingScreen />
      <AmbientAudio />
      <ThemeToggle />

      {isAdmin && (
        <div style={{
          position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
          background: 'linear-gradient(135deg,rgba(var(--accent-rgb), 0.15),rgba(245,215,142,0.1))',
          border: '1px solid rgba(var(--accent-rgb), 0.25)',
          backdropFilter: 'blur(16px)',
          color: '#fff', padding: '8px 20px 8px 28px', borderRadius: '99px',
          fontSize: '0.82rem', fontWeight: 800,
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'var(--accent)', boxShadow:'0 0 8px var(--accent)', display:'inline-block' }} />
          ADMIN ACCESS ENABLED
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', padding: '4px 14px', borderRadius: '99px',
              fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer'
            }}
          >
            LOGOUT
          </button>
        </div>
      )}

      {/* 1 ── Hero */}
      <HeroSlideshow onLogoClick={toggleAdmin} initialProjects={projects} />

      {/* 2 ── Artist Profile */}
      <ArtistProfile
        name="ARIA VOSS"
        handle="@ariavoss"
        gender="She / Her"
        joined="Jan 2023"
        bio="Digital alchemist turning raw pixels into emotional landscapes. Specializing in surreal CGI, atmospheric concept art, and motion design that lives between dreams and data."
        totalLikes={1842}
        totalWorks={projects.length}
        isAdmin={isAdmin}
      />

      {/* 3 ── Portfolio Grid (Fiverr Style) */}
      <PortfolioRedesign initialProjects={projects} isAdmin={isAdmin} onRefresh={loadData} />

      {/* 3.5 ── Project Process (Visual Timeline Roadmap) */}
      <ProjectProcess />

      {/* 4 ── Tech Stack Grid */}
      <TechStackGrid isAdmin={isAdmin} />

      {/* 5 ── Payment Methods */}
      <PaymentSection selectedMethods={['paypal', 'cashapp', 'crypto', 'bank']} isAdmin={isAdmin} />

      {/* 5.5 ── Pricing Tiers */}
      <PricingSection isAdmin={isAdmin} />

      {/* 5.8 ── Starter Kit Requirements */}
      <OnboardingSection />

      {/* 6 ── Book a Call */}
      <BookCallSection isAdmin={isAdmin} />

      {/* 7 ── Testimonials (Angled) */}
      <Testimonials isAdmin={isAdmin} />

      {/* 8 ── Social Links (Dynamic) */}
      <SocialLinksSection isAdmin={isAdmin} links={socials.length > 0 ? socials : [
        { platformId: 'discord',    value: 'ariavoss#0001' }
      ]} />

      {/* 9 ── FAQ Section */}
      <FAQSection isAdmin={isAdmin} />

      {/* 10 ── Contact */}
      <ContactSection />

      {/* 11 ── Footer */}
      <footer style={{
        padding: '2.5rem 5%',
        background: 'var(--sec-footer)',
        borderTop: '1px solid var(--card-border)',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div 
          className="font-bebas" 
          onClick={toggleAdmin}
          style={{ fontSize: '1.6rem', color: 'var(--fg)', letterSpacing: '0.08em', cursor: 'pointer', userSelect: 'none' }}
        >
          VISIONARY<span style={{ color: 'var(--accent)' }}>PORT</span>
        </div>
        <p style={{
          margin: 0, color: 'var(--muted)', fontSize: '0.82rem',
        }}>
          © 2026 VisionaryPort · All work is property of the respective artists.
        </p>
      </footer>
      </div>
    </main>
  );
}
