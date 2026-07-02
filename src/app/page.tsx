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
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at top, color-mix(in srgb, var(--primary) 20%, transparent), transparent 34%), radial-gradient(circle at bottom right, color-mix(in srgb, var(--secondary) 18%, transparent), transparent 32%), linear-gradient(180deg, var(--background) 0%, color-mix(in srgb, var(--background) 88%, var(--primary)) 100%)`,
        }}
      />
      <div
        className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)' }}
      />
      <div
        className="absolute bottom-6 left-6 h-48 w-48 rounded-full blur-3xl"
        style={{ backgroundColor: 'color-mix(in srgb, var(--secondary) 10%, transparent)' }}
      />

      <div className="relative flex w-full max-w-xl flex-col items-center text-center">
        <div
          className="mb-10 flex items-center gap-3 rounded-full border px-4 py-2 text-sm backdrop-blur-xl"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--card-background)',
            color: 'var(--foreground)',
          }}
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{
              backgroundColor: 'var(--primary)',
              boxShadow: '0 0 18px color-mix(in srgb, var(--primary) 70%, transparent)',
            }}
          />
          Learnbit is loading
        </div>

        <div className="relative mb-10 flex h-40 w-40 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: 'var(--border)' }}
          />
          <div
            className="absolute inset-3 rounded-full border"
            style={{ borderColor: 'var(--border)' }}
          />
          <div
            className="absolute inset-6 rounded-full border animate-spin [animation-duration:3.5s]"
            style={{
              borderColor: 'var(--border)',
              borderTopColor: 'var(--primary)',
            }}
          />
          <div
            className="absolute inset-10 rounded-full blur-md animate-pulse"
            style={{
              background: `radial-gradient(circle, color-mix(in srgb, var(--primary) 45%, transparent) 0%, color-mix(in srgb, var(--secondary) 22%, transparent) 45%, transparent 72%)`,
            }}
          />
          <div className="relative flex h-20 w-20 items-center justify-center backdrop-blur-xl">
            <span
              className="text-4xl leading-none tracking-[0.08em]"
              style={{ fontFamily: 'var(--font-brand)', color: 'var(--foreground)' }}
            >
              Learnbit.
            </span>
          </div>
        </div>

        <h1
          className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl"
          style={{ color: 'var(--foreground)' }}
        >
          Learn faster with a focused workspace.
        </h1>
        <p
          className="mt-4 max-w-lg text-base leading-7 sm:text-lg"
          style={{ color: 'var(--foreground)', opacity: 0.72 }}
        >
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
