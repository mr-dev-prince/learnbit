'use client';

import Strands from '@/components/ui/Strands';
import { Sparkles } from 'lucide-react';

export default function SplashScreen() {
  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 select-none"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      {/* OGL Mesh Strands Ambient Background - Shared with Hero */}
      <div className="absolute inset-0 opacity-90 pointer-events-none">
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

      {/* Atmospheric Radial Overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--background) 20%, transparent) 0%, color-mix(in srgb, var(--background) 50%, transparent) 40%, var(--background) 100%)',
        }}
      />
      <div
        className="absolute -left-24 top-1/4 h-80 w-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'color-mix(in srgb, var(--secondary) 20%, transparent)' }}
      />
      <div
        className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'color-mix(in srgb, var(--primary) 22%, transparent)' }}
      />

      {/* Main Glassmorphic Container */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <div
          className="w-full rounded-3xl border p-8 sm:p-10 shadow-2xl backdrop-blur-2xl transition-all duration-300"
          style={{
            borderColor: 'color-mix(in srgb, var(--border) 75%, transparent)',
            backgroundColor: 'color-mix(in srgb, var(--card-background) 75%, transparent)',
            boxShadow: '0 25px 50px -12px var(--shadow-color)',
          }}
        >
          {/* Status Badge */}
          <div
            className="inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-xs sm:text-sm font-medium backdrop-blur-md mb-8"
            style={{
              borderColor: 'color-mix(in srgb, var(--border) 70%, transparent)',
              backgroundColor: 'color-mix(in srgb, var(--card-background) 65%, transparent)',
              color: 'var(--foreground)',
            }}
          >
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ backgroundColor: 'var(--primary)' }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ backgroundColor: 'var(--primary)' }}
              />
            </span>
            Initializing Learnbit
          </div>

          {/* Core Logo & Icon Lockup */}
          <div className="mb-6 flex flex-col items-center">
            <div
              className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border shadow-inner animate-pulse"
              style={{
                borderColor: 'color-mix(in srgb, var(--primary) 40%, transparent)',
                background:
                  'linear-gradient(135deg, color-mix(in srgb, var(--primary) 20%, transparent), color-mix(in srgb, var(--secondary) 15%, transparent))',
                boxShadow: '0 0 25px color-mix(in srgb, var(--primary) 25%, transparent)',
              }}
            >
              <Sparkles className="h-8 w-8 text-orange-600" />
            </div>

            <h1
              className="text-5xl sm:text-6xl font-black leading-none tracking-tight"
              style={{ fontFamily: 'var(--font-brand)', color: 'var(--foreground)' }}
            >
              learn<span className="text-orange-600">bit.</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p
            className="text-base sm:text-lg font-medium leading-relaxed max-w-xs mx-auto"
            style={{ color: 'color-mix(in srgb, var(--foreground) 75%, transparent)' }}
          >
            Personal learning, organized with intent.
          </p>

          {/* Progress Indicator */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <div
              className="h-1.5 w-48 overflow-hidden rounded-full border relative"
              style={{
                borderColor: 'color-mix(in srgb, var(--border) 60%, transparent)',
                backgroundColor: 'color-mix(in srgb, var(--surface-muted) 80%, transparent)',
              }}
              aria-label="Loading workspace"
            >
              <div
                className="h-full rounded-full animate-pulse"
                style={{
                  width: '100%',
                  background:
                    'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 50%, var(--primary) 100%)',
                  boxShadow: '0 0 12px color-mix(in srgb, var(--primary) 60%, transparent)',
                }}
              />
            </div>
            <span
              className="text-xs font-mono tracking-wider opacity-60 uppercase"
              style={{ color: 'var(--foreground)' }}
            >
              Loading workspace...
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
