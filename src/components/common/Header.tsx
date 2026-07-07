'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, MoonStar, Search, SunMedium } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

interface HeaderProps {
  email: string;
  fullName: string;
}

const Header: React.FC<HeaderProps> = ({ email, fullName }) => {
  const { theme, toggleTheme } = useTheme();
  const displayName = fullName.trim() || email;
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <header
      className="sticky top-0 z-40 border-b border-border bg-(--sidebar-header-background) backdrop-blur-xl"
      style={{ borderBottomColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between gap-4 px-6 py-2 lg:px-8">
        <div className="flex-1 mr-4">
          <div
            className="flex max-w-md items-center gap-2 rounded-lg border bg-surface/90 px-4 py-2 transition-all duration-200 hover:shadow-sm"
            style={{ borderColor: 'var(--border)' }}
          >
            <Search size={18} style={{ color: 'var(--foreground)', opacity: 0.55 }} />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-60"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-lg border p-2 text-sm font-medium transition-colors hover:bg-surface/80"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunMedium size={18} /> : <MoonStar size={18} />}
          </button>

          <button
            className="relative rounded-lg border p-2 transition-all duration-200 hover:bg-surface/80"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span
              className="absolute top-1 right-1 h-1 w-1 rounded-full"
              style={{ backgroundColor: 'var(--tertiary)' }}
            />
          </button>

          <div className="h-6 w-px bg-border" />

          <Link
            href="/settings"
            className="flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-surface/80"
            style={{ color: 'var(--foreground)' }}
            aria-label="User profile"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {initials || 'U'}
            </div>
            <div className="hidden sm:block">
              <span className="block text-sm font-medium">{displayName}</span>
              <span className="block text-xs opacity-65">{email}</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
