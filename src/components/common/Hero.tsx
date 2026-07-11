'use client';

import Link from 'next/link';
import Strands from '@/components/ui/Strands';

export default function Hero() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      <div className="absolute inset-0 opacity-100">
        <Strands
          className="h-full w-full"
          colors={['#f97316', '#fb7185', '#22c55e', '#38bdf8']}
          count={6}
          speed={0.4}
          amplitude={1.1}
          waviness={1.25}
          thickness={1}
          glow={3}
          spread={1.05}
          intensity={0.92}
          saturation={1.4}
          opacity={1}
          scale={1.15}
          glass
          refraction={0.8}
          dispersion={0.35}
          glassSize={0.9}
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--background) 12%, transparent) 0%, color-mix(in srgb, var(--background) 46%, transparent) 30%, color-mix(in srgb, var(--background) 80%, transparent) 65%, var(--background) 100%)',
        }}
      />
      <div
        className="absolute -left-32 top-20 h-72 w-72 rounded-full blur-3xl"
        style={{ background: 'color-mix(in srgb, var(--secondary) 22%, transparent)' }}
      />
      <div
        className="absolute bottom-12 -right-16 h-80 w-80 rounded-full blur-3xl"
        style={{ background: 'color-mix(in srgb, var(--primary) 24%, transparent)' }}
      />

      <div className="absolute inset-x-0 top-0 z-10 flex justify-center px-6 pt-6 sm:pt-8">
        <Link
          href="/"
          aria-label="Learnbit home"
          className="inline-flex items-center justify-center"
        >
          <p
            className="text-6xl leading-none font-black"
            style={{ fontFamily: 'var(--font-brand)', color: 'var(--foreground)' }}
          >
            learn
            <span className="text-6xl leading-none font-black text-orange-600">bit.</span>
          </p>
        </Link>
      </div>

      <section className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-28 sm:px-10 sm:py-32 lg:px-12">
        <div className="grid w-full gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-center">
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm backdrop-blur-xl"
              style={{
                borderColor: 'color-mix(in srgb, var(--border) 70%, transparent)',
                backgroundColor: 'color-mix(in srgb, var(--card-background) 68%, transparent)',
              }}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: 'var(--primary)',
                  boxShadow: '0 0 18px color-mix(in srgb, var(--primary) 75%, transparent)',
                }}
              />
              Personal learning, organized with intent
            </div>

            <h1
              className="mt-8 max-w-4xl text-5xl leading-[0.96] font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl"
              style={{ fontFamily: 'var(--font-brand)', color: 'var(--foreground)' }}
            >
              Build a learning system that keeps your curiosity moving.
            </h1>

            <p
              className="mt-6 max-w-2xl text-lg leading-8 sm:text-xl"
              style={{ color: 'color-mix(in srgb, var(--foreground) 74%, transparent)' }}
            >
              Learnbit helps you capture ideas, track what matters, and return to your best learning
              threads before they fade into tabs and bookmarks.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: '#0f172a',
                  boxShadow: '0 16px 48px color-mix(in srgb, var(--primary) 32%, transparent)',
                }}
              >
                Create account
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border px-6 py-3.5 text-sm font-semibold backdrop-blur-xl transition-colors duration-200"
                style={{
                  borderColor: 'color-mix(in srgb, var(--border) 75%, transparent)',
                  backgroundColor: 'color-mix(in srgb, var(--card-background) 62%, transparent)',
                  color: 'var(--foreground)',
                }}
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
