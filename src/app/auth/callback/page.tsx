'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase automatically handles the OAuth token exchange
      // when the page loads with the hash fragment from the redirect
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth callback error:', error);
        router.push('/admin-gateway');
        return;
      }

      if (session) {
        // Successfully authenticated — go home with admin mode
        router.push('/');
      } else {
        // No session yet — wait for the hash to be processed
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            subscription.unsubscribe();
            router.push('/');
          }
        });

        // Timeout fallback
        setTimeout(() => {
          subscription.unsubscribe();
          router.push('/admin-gateway');
        }, 5000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <main style={{
      minHeight: '100dvh',
      background: '#080808',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px', height: '48px', border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: 'var(--accent)', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1.5rem'
        }} />
        <p className="font-syne" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
          Authenticating...
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Completing Google sign-in
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
