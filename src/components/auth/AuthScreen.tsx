'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Strands from '@/components/ui/Strands';
import { createClient } from '@/utils/supabase/client';

type AuthMode = 'login' | 'signup';

interface AuthScreenProps {
  mode: AuthMode;
}

interface FormState {
  email: string;
  password: string;
}

const GOOGLE_ICON = (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.5c-.2 1.3-.8 2.4-1.8 3.1l3 2.3c1.8-1.6 2.8-4.1 2.8-7 0-.7-.1-1.5-.2-2.3H12Z"
    />
    <path
      fill="#4285F4"
      d="M12 22c2.5 0 4.6-.8 6.2-2.2l-3-2.3c-.8.6-1.9 1-3.2 1-2.4 0-4.4-1.6-5.1-3.8l-3.1 2.4C5.4 20 8.4 22 12 22Z"
    />
    <path
      fill="#FBBC05"
      d="M6.9 14.7c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9L3.8 8.5C3.3 9.6 3 10.8 3 12s.3 2.4.8 3.5l3.1-2.4Z"
    />
    <path
      fill="#34A853"
      d="M12 5.5c1.4 0 2.7.5 3.7 1.4l2.7-2.7C16.6 2.7 14.5 2 12 2 8.4 2 5.4 4 3.8 8.5l3.1 2.4c.7-2.2 2.7-3.8 5.1-3.8Z"
    />
  </svg>
);

const MODE_COPY: Record<
  AuthMode,
  {
    eyebrow: string;
    title: string;
    description: string;
    submitLabel: string;
    alternateLabel: string;
    alternateHref: string;
    alternateText: string;
    successMessage: string;
  }
> = {
  login: {
    eyebrow: 'Welcome back',
    title: 'Pick up your learning where you left off.',
    description:
      'Sign in to review your study queue, track active topics, and keep your learning system moving.',
    submitLabel: 'Sign in',
    alternateLabel: 'Create an account',
    alternateHref: '/signup',
    alternateText: 'New to Learnbit?',
    successMessage: 'Signed in successfully. Redirecting to your dashboard...',
  },
  signup: {
    eyebrow: 'Create your workspace',
    title: 'Start building a calmer way to learn.',
    description:
      'Create an account to organize tasks, schedule revision, and get AI-powered suggestions for what to learn next.',
    submitLabel: 'Create account',
    alternateLabel: 'Back to login',
    alternateHref: '/login',
    alternateText: 'Already have an account?',
    successMessage: 'Account created. Check your email to confirm your address, then sign in.',
  },
};

export default function AuthScreen({ mode }: AuthScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState<FormState>({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(searchParams.get('message'));
  const [error, setError] = useState<string | null>(searchParams.get('error'));

  const copy = MODE_COPY[mode];

  const updateField = (field: keyof FormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleEmailAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const supabase = createClient();

      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formState.email,
          password: formState.password,
        });

        if (signInError) {
          setError(signInError.message);
          return;
        }

        setMessage(copy.successMessage);
        router.replace('/dashboard');
        router.refresh();
        return;
      }

      const emailRedirectTo = `${window.location.origin}/auth/callback`;
      const { error: signUpError } = await supabase.auth.signUp({
        email: formState.email,
        password: formState.password,
        options: {
          emailRedirectTo,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setMessage(copy.successMessage);
      setFormState({ email: formState.email, password: '' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setIsSubmitting(false);
      }
    } catch {
      setError('Google sign-in could not be started. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      <div className="absolute inset-0 opacity-100">
        <Strands
          className="h-full w-full"
          colors={['#f97316', '#fb7185', '#22c55e', '#38bdf8']}
          count={5}
          speed={0.34}
          amplitude={1.05}
          waviness={1.2}
          thickness={0.95}
          glow={2.8}
          spread={1}
          intensity={0.82}
          saturation={1.35}
          opacity={0.98}
          scale={1.25}
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--background) 14%, transparent) 0%, color-mix(in srgb, var(--background) 56%, transparent) 40%, var(--background) 100%)',
        }}
      />
      <div
        className="absolute -left-24 top-20 h-80 w-80 rounded-full blur-3xl"
        style={{ background: 'color-mix(in srgb, var(--secondary) 22%, transparent)' }}
      />
      <div
        className="absolute -right-20 bottom-10 h-96 w-96 rounded-full blur-3xl"
        style={{ background: 'color-mix(in srgb, var(--primary) 20%, transparent)' }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16 sm:px-10 lg:px-12">
        <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(380px,0.85fr)] lg:items-center">
          <section className="max-w-3xl">
            <Link href="/" className="inline-flex items-center" aria-label="Learnbit home">
              <p
                className="text-5xl leading-none font-black sm:text-6xl"
                style={{ fontFamily: 'var(--font-brand)', color: 'var(--foreground)' }}
              >
                learn<span className="text-orange-600">bit.</span>
              </p>
            </Link>

            <div
              className="mt-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm backdrop-blur-xl"
              style={{
                borderColor: 'color-mix(in srgb, var(--border) 70%, transparent)',
                backgroundColor: 'color-mix(in srgb, var(--card-background) 66%, transparent)',
              }}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: 'var(--primary)',
                  boxShadow: '0 0 18px color-mix(in srgb, var(--primary) 75%, transparent)',
                }}
              />
              {copy.eyebrow}
            </div>

            <h1
              className="mt-8 max-w-3xl text-5xl leading-[0.96] font-semibold tracking-[-0.04em] sm:text-6xl"
              style={{ fontFamily: 'var(--font-brand)', color: 'var(--foreground)' }}
            >
              {copy.title}
            </h1>

            <p
              className="mt-6 max-w-2xl text-lg leading-8 sm:text-xl"
              style={{ color: 'color-mix(in srgb, var(--foreground) 74%, transparent)' }}
            >
              {copy.description}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                'Track learning tasks and progress',
                'Plan daily, weekly, and monthly focus',
                'Manage revision without losing momentum',
                'Get AI suggestions for next best topics',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border px-4 py-4 text-sm backdrop-blur-xl"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--border) 68%, transparent)',
                    backgroundColor: 'color-mix(in srgb, var(--card-background) 54%, transparent)',
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section
            className="relative overflow-hidden rounded-4xl border p-6 shadow-2xl backdrop-blur-2xl sm:p-8"
            style={{
              borderColor: 'color-mix(in srgb, var(--border) 78%, transparent)',
              backgroundColor: 'color-mix(in srgb, var(--card-background) 74%, transparent)',
              boxShadow: '0 40px 100px color-mix(in srgb, black 48%, transparent)',
            }}
          >
            <div
              className="absolute inset-x-6 top-0 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent, color-mix(in srgb, var(--primary) 45%, white), transparent)',
              }}
            />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: 'color-mix(in srgb, var(--foreground) 62%, transparent)' }}
                  >
                    {mode === 'login' ? 'Sign in to continue' : 'Create your account'}
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold">
                    {mode === 'login' ? 'Welcome back' : 'Join Learnbit'}
                  </h2>
                </div>
                <Link
                  href={copy.alternateHref}
                  className="rounded-full border px-3 py-2 text-xs font-semibold backdrop-blur-xl"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--border) 72%, transparent)',
                    backgroundColor: 'color-mix(in srgb, var(--background) 16%, transparent)',
                  }}
                >
                  {copy.alternateLabel}
                </Link>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isSubmitting}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-3.5 text-sm font-semibold transition-opacity disabled:opacity-60"
                style={{
                  borderColor: 'color-mix(in srgb, var(--border) 72%, transparent)',
                  backgroundColor: 'color-mix(in srgb, var(--background) 16%, transparent)',
                }}
              >
                {GOOGLE_ICON}
                Continue with Google
              </button>

              <div className="mt-6 flex items-center gap-4">
                <div
                  className="h-px flex-1"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--border) 80%, transparent)' }}
                />
                <span
                  className="text-xs uppercase tracking-[0.16em]"
                  style={{ color: 'color-mix(in srgb, var(--foreground) 56%, transparent)' }}
                >
                  Or with email
                </span>
                <div
                  className="h-px flex-1"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--border) 80%, transparent)' }}
                />
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleEmailAuth}>
                <label className="block">
                  <span
                    className="mb-2 block text-sm font-medium"
                    style={{ color: 'color-mix(in srgb, var(--foreground) 68%, transparent)' }}
                  >
                    Email address
                  </span>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full rounded-lg border px-4 py-3.5 text-sm outline-none transition"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--border) 74%, transparent)',
                      backgroundColor: 'color-mix(in srgb, var(--background) 18%, transparent)',
                    }}
                  />
                </label>

                <label className="block">
                  <span
                    className="mb-2 block text-sm font-medium"
                    style={{ color: 'color-mix(in srgb, var(--foreground) 68%, transparent)' }}
                  >
                    Password
                  </span>
                  <input
                    type="password"
                    value={formState.password}
                    onChange={(event) => updateField('password', event.target.value)}
                    required
                    minLength={6}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
                    className="w-full rounded-lg border px-4 py-3.5 text-sm outline-none transition"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--border) 74%, transparent)',
                      backgroundColor: 'color-mix(in srgb, var(--background) 18%, transparent)',
                    }}
                  />
                </label>

                {error && (
                  <div
                    className="rounded-lg border px-4 py-3 text-sm"
                    style={{
                      borderColor: 'rgba(239, 68, 68, 0.35)',
                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                      color: '#b91c1c',
                    }}
                  >
                    {error}
                  </div>
                )}

                {message && (
                  <div
                    className="rounded-lg border px-4 py-3 text-sm"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--secondary) 42%, transparent)',
                      backgroundColor: 'color-mix(in srgb, var(--secondary) 14%, transparent)',
                    }}
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg px-4 py-3.5 text-sm font-semibold transition-transform duration-200 disabled:opacity-60"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: '#0f172a',
                    boxShadow: '0 16px 48px color-mix(in srgb, var(--primary) 32%, transparent)',
                  }}
                >
                  {isSubmitting ? 'Please wait...' : copy.submitLabel}
                </button>
              </form>

              <p
                className="mt-6 text-center text-sm"
                style={{ color: 'color-mix(in srgb, var(--foreground) 66%, transparent)' }}
              >
                {copy.alternateText}{' '}
                <Link href={copy.alternateHref} className="font-semibold text-orange-600">
                  {copy.alternateLabel}
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
