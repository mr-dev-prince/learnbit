'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Lightbulb,
  CheckCircle,
  Settings,
  Plus,
  ChevronLeft,
  X,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={24} />, href: '/dashboard' },
    { id: 'revision', label: 'Revision Queue', icon: <BookOpen size={24} />, href: '/revision-queue' },
    { id: 'suggestions', label: 'Suggestions', icon: <Lightbulb size={24} />, href: '/suggestions' },
    { id: 'completed', label: 'Completed', icon: <CheckCircle size={24} />, href: '/completed' },
    { id: 'settings', label: 'Settings', icon: <Settings size={24} />, href: '/settings' },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 border-r transition-all duration-300 ease-in-out flex flex-col ${
          isCollapsed ? 'w-20' : 'w-64'
        } md:relative md:translate-x-0`}
        style={{
          borderRightColor: 'var(--primary)',
          borderRightWidth: '1px',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b transition-colors"
          style={{ borderBottomColor: 'var(--primary)' }}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                LB
              </div>
              <span className="text-white font-semibold text-lg">Learnbit</span>
            </div>
          )}
          {isCollapsed && (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs mx-auto"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              LB
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mx-2 my-2 p-2 rounded-lg transition-colors text-slate-300 hover:text-white"
          style={{ backgroundColor: 'transparent' }}
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            size={20}
            className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative hover:text-white text-slate-300"
              style={{}}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="text-base flex-shrink-0" style={{ color: 'var(--primary)' }}>
                {item.icon}
              </span>
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div
                  className="absolute left-full ml-2 px-3 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 text-white"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  {item.label}
                </div>
              )}
            </a>
          ))}
        </nav>

        {/* Quick Add Button */}
        <div
          className="p-4 border-t transition-colors"
          style={{ borderTopColor: 'var(--primary)' }}
        >
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-semibold transition-all duration-200 active:scale-95 hover:opacity-90 ${
              isCollapsed ? 'p-3' : ''
            }`}
            style={{ backgroundColor: 'var(--primary)' }}
            aria-label="Quick add"
          >
            <Plus size={20} />
            {!isCollapsed && <span>Quick Add</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <div className="fixed inset-0 md:hidden pointer-events-none" />

      {/* Quick Add Modal */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className="bg-slate-900 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border animate-in fade-in zoom-in duration-200"
            style={{ borderColor: 'var(--primary)', borderWidth: '1px' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Quick Add</h2>
              <button
                onClick={() => setIsQuickAddOpen(false)}
                className="p-2 rounded-lg transition-colors text-slate-400 hover:text-white"
                style={{ backgroundColor: 'transparent' }}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="What would you like to add?"
                className="w-full px-4 py-3 bg-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none transition-colors"
                style={{
                  borderColor: 'var(--primary)',
                  borderWidth: '1px',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setIsQuickAddOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border text-slate-300 hover:bg-slate-800 transition-colors font-medium"
                  style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsQuickAddOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg text-white hover:opacity-90 transition-colors font-medium"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
