'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface LogoutButtonProps {
  className?: string;
  compact?: boolean;
}

export default function LogoutButton({ className = '', compact = false }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/login');
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={className}
      style={{ color: 'var(--foreground)' }}
      aria-label="Log out"
    >
      <LogOut size={18} />
      {!compact && <span>Log out</span>}
    </button>
  );
}
