'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SPLASH_DURATION = 5000;

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      router.replace('/dashboard');
    }, SPLASH_DURATION);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-6 text-white">
      <style>{`
        .primary-gradient {
          background: linear-gradient(
            135deg,
            var(--primary) 0%,
            var(--secondary) 100%
          );
        }
        .primary-glow {
          box-shadow: 0 0 80px rgba(92, 107, 192, 0.3);
        }
        .loading-dot {
          background-color: var(--primary);
        }
      `}</style>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at top, rgba(92, 107, 192, 0.2), transparent 34%), radial-gradient(circle at bottom right, rgba(129, 199, 132, 0.18), transparent 32%), linear-gradient(180deg, #050816 0%, #07111f 100%)`,
        }}
      />
      <div
        className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: 'rgba(92, 107, 192, 0.15)' }}
      />
      <div
        className="absolute bottom-6 left-6 h-48 w-48 rounded-full blur-3xl"
        style={{ backgroundColor: 'rgba(129, 199, 132, 0.1)' }}
      />

      <div className="relative flex w-full max-w-xl flex-col items-center text-center">
        <div
          className="mb-10 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur-xl primary-glow"
          style={{ borderColor: 'rgba(92, 107, 192, 0.5)' }}
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{
              backgroundColor: 'var(--primary)',
              boxShadow: '0 0 18px rgba(92, 107, 192, 0.9)',
            }}
          />
          Learnbit is loading
        </div>

        <div className="relative mb-10 flex h-40 w-40 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: 'rgba(92, 107, 192, 0.2)' }}
          />
          <div className="absolute inset-3 rounded-full border border-white/10" />
          <div
            className="absolute inset-6 rounded-full border animate-spin [animation-duration:3.5s]"
            style={{
              borderColor: 'rgba(92, 107, 192, 0.2)',
              borderTopColor: 'var(--primary)',
            }}
          />
          <div
            className="absolute inset-10 rounded-full blur-md animate-pulse"
            style={{
              background: `radial-gradient(circle, rgba(92, 107, 192, 0.45) 0%, rgba(129, 199, 132, 0.22) 45%, rgba(15, 23, 42, 0) 72%)`,
            }}
          />
          <div
            className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-3xl font-semibold tracking-[0.35em] text-white backdrop-blur-xl"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(92, 107, 192, 0.5)',
              boxShadow: '0 0 40px rgba(92, 107, 192, 0.28)',
            }}
          >
            LB
          </div>
        </div>

        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Learn faster with a focused workspace.
        </h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
          Preparing your dashboard and loading the first view.
        </p>

        <div className="mt-10 flex items-center gap-2" aria-label="Loading progress">
          <span
            className="h-2.5 w-2.5 rounded-full animate-bounce [animation-delay:-0.3s]"
            style={{ backgroundColor: 'var(--primary)' }}
          />
          <span
            className="h-2.5 w-2.5 rounded-full animate-bounce [animation-delay:-0.15s]"
            style={{ backgroundColor: 'var(--secondary)' }}
          />
          <span
            className="h-2.5 w-2.5 rounded-full animate-bounce"
            style={{ backgroundColor: 'var(--tertiary)' }}
          />
        </div>
      </div>
    </main>
  );
}
