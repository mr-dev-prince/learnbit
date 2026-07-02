'use client';

import { useState } from 'react';
import { LockKeyhole, Save, UserRound } from 'lucide-react';
import LogoutButton from '@/components/auth/LogoutButton';
import { createClient } from '@/utils/supabase/client';

interface ProfileSettingsProps {
  email: string;
  fullName: string;
}

export default function ProfileSettings({ email, fullName }: ProfileSettingsProps) {
  const [name, setName] = useState(fullName);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleProfileSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingProfile(true);
    setMessage(null);
    setError(null);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: name.trim(),
        },
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setMessage('Profile updated successfully.');
    } catch {
      setError('Unable to update your profile right now.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingPassword(true);
    setMessage(null);
    setError(null);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setMessage('Password updated successfully.');
      setPassword('');
    } catch {
      setError('Unable to update your password right now.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div
        className="rounded-2xl border p-6"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--card-background)',
        }}
      >
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <UserRound size={20} style={{ color: 'var(--primary)' }} />
          Profile
        </h2>
        <p className="mt-2 text-sm" style={{ color: 'color-mix(in srgb, var(--foreground) 68%, transparent)' }}>
          Manage how your account appears across Learnbit.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleProfileSave}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Full name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'color-mix(in srgb, var(--background) 18%, transparent)',
              }}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Email address</span>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-2xl border px-4 py-3 text-sm opacity-70 outline-none"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'color-mix(in srgb, var(--background) 12%, transparent)',
              }}
            />
          </label>

          <button
            type="submit"
            disabled={isSavingProfile}
            className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold"
            style={{
              backgroundColor: 'var(--primary)',
              color: '#0f172a',
            }}
          >
            <Save size={16} />
            {isSavingProfile ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </div>

      <div
        className="rounded-2xl border p-6"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--card-background)',
        }}
      >
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <LockKeyhole size={20} style={{ color: 'var(--primary)' }} />
          Security
        </h2>
        <p className="mt-2 text-sm" style={{ color: 'color-mix(in srgb, var(--foreground) 68%, transparent)' }}>
          Update your password or end the current session.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handlePasswordSave}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">New password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
              placeholder="Create a new password"
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'color-mix(in srgb, var(--background) 18%, transparent)',
              }}
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isSavingPassword}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold"
              style={{
                backgroundColor: 'var(--primary)',
                color: '#0f172a',
              }}
            >
              <Save size={16} />
              {isSavingPassword ? 'Updating...' : 'Update password'}
            </button>

            <LogoutButton
              className="inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold"
            />
          </div>
        </form>

        {error && (
          <div
            className="mt-4 rounded-2xl border px-4 py-3 text-sm"
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
            className="mt-4 rounded-2xl border px-4 py-3 text-sm"
            style={{
              borderColor: 'color-mix(in srgb, var(--secondary) 42%, transparent)',
              backgroundColor: 'color-mix(in srgb, var(--secondary) 14%, transparent)',
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
