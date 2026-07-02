'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Lightbulb, CheckCircle, Settings, Plus } from 'lucide-react';
import CollapseButton from '@/components/common/CollapseButton';
import QuickAddModal from '@/components/common/QuickAddModal';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={24} />,
      href: '/dashboard',
    },
    {
      id: 'revision',
      label: 'Revision Queue',
      icon: <BookOpen size={24} />,
      href: '/revision-queue',
    },
    {
      id: 'suggestions',
      label: 'Suggestions',
      icon: <Lightbulb size={24} />,
      href: '/suggestions',
    },
    { id: 'completed', label: 'Completed', icon: <CheckCircle size={24} />, href: '/completed' },
    { id: 'settings', label: 'Settings', icon: <Settings size={24} />, href: '/settings' },
  ];

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-30 h-screen shadow-md transition-all duration-300 ease-in-out flex flex-col ${
          isCollapsed ? 'w-20' : 'w-56'
        } bg-(--sidebar-header-background) backdrop-blur-xl md:relative md:translate-x-0`}
        style={{ borderRightColor: 'var(--border)' }}
      >
        <div
          className="flex items-center justify-between p-4"
          style={{ borderBottomColor: 'var(--border)' }}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-3 justify-start">
              <p
                className="text-4xl leading-none font-black"
                style={{ fontFamily: 'var(--font-brand)', color: 'var(--foreground)' }}
              >
                learn<span className="text-orange-600 leading-none font-black">bit.</span>
              </p>
            </div>
          )}
          {isCollapsed && (
            <span
              className="mx-auto text-4xl font-black leading-none"
              style={{ fontFamily: 'var(--font-brand)', color: 'var(--foreground)' }}
            >
              l<span className="text-orange-600 text-4xl font-black leading-none">b.</span>
            </span>
          )}
        </div>

        <nav className="flex-1 px-2 py-3 space-y-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`group relative flex items-center ${isCollapsed ? 'justify-center' : ''} gap-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/20'
                    : 'hover:bg-primary/10 hover:text-foreground'
                }`}
                style={{ color: 'var(--foreground)' }}
                title={isCollapsed ? item.label : undefined}
              >
                <span
                  className="shrink-0 text-xl"
                  style={{ color: isActive ? 'var(--primary)' : 'var(--primary)' }}
                >
                  {item.icon}
                </span>
                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}

                {isCollapsed && (
                  <div
                    className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded px-3 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div
          className="border-t relative p-4 transition-colors"
          style={{ borderTopColor: 'var(--border)' }}
        >
          <div className="mb-3 flex items-center justify-between absolute -top-3 -right-3 bg-background rounded-lg">
            <CollapseButton
              isCollapsed={isCollapsed}
              onToggle={() => setIsCollapsed((current) => !current)}
            />
          </div>
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-white transition-all duration-200 active:scale-95 hover:opacity-90 ${
              isCollapsed ? 'px-3 py-3' : ''
            }`}
            style={{ backgroundColor: 'var(--primary)' }}
            aria-label="Quick add"
          >
            <Plus size={20} />
            {!isCollapsed && <span>Quick Add</span>}
          </button>
        </div>
      </aside>

      <div className="fixed inset-0 pointer-events-none md:hidden" />

      <QuickAddModal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />
    </>
  );
};

export default Sidebar;
