'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin-gateway');
      } else {
        setChecking(false);
      }
    };
    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.push('/admin-gateway');
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (checking) {
    return (
      <div style={{
        minHeight: '100dvh', background: '#080808',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '1rem', color: '#fff'
      }}>
        <Loader2 size={32} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--accent)' }} />
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Verifying access...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
