'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Hero from '@/components/common/Hero';
import SplashScreen from '@/components/ui/SplashScreen';
import { createClient } from '@/utils/supabase/client';

const SPLASH_DURATION = 3000;
const FADE_DURATION_MS = 700;

export default function Home() {
  const router = useRouter();
  const [showLanding, setShowLanding] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          router.replace('/dashboard');
          return;
        }
      } catch {
        // Fall back to public landing page when auth check is unavailable.
      }

      setShowLanding(true);
    }, SPLASH_DURATION);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  useEffect(() => {
    if (!showLanding) return;

    const hideSplashTimeoutId = window.setTimeout(() => {
      setShowSplash(false);
    }, FADE_DURATION_MS);

    return () => window.clearTimeout(hideSplashTimeoutId);
  }, [showLanding]);

  return (
    <div
      className="relative min-h-screen"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-out ${
          showLanding ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Hero />
      </div>

      {showSplash && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            showLanding ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <SplashScreen />
        </div>
      )}
    </div>
  );
}
