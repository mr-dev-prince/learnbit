'use client';

import React from 'react';
import { Bell, Search } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        borderBottomColor: 'var(--primary)',
      }}
    >
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left Section - Search */}
        <div className="flex-1 mr-4">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border transition-all duration-200 hover:border-primary max-w-md"
            style={{ borderColor: 'var(--primary)' }}
          >
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-white placeholder-slate-400 outline-none flex-1 text-sm"
            />
          </div>
        </div>

        {/* Right Section - Notifications & Profile */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg transition-all duration-200 text-slate-300 hover:text-white"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'var(--primary)',
            }}
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span
              className="absolute top-1 right-1 h-2 w-2 rounded-full"
              style={{ backgroundColor: 'var(--tertiary)' }}
            />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-slate-700" />

          {/* User Profile */}
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800/50 text-slate-300 hover:text-white"
            aria-label="User profile"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              U
            </div>
            <span className="text-sm font-medium hidden sm:inline">User</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
