'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

interface LogoutButtonProps {
  className?: string;
  compact?: boolean;
}

export default function LogoutButton({ className = '', compact = false }: LogoutButtonProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace('/login');
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={className}
        style={{ color: 'var(--foreground)' }}
        aria-label="Log out"
      >
        <LogOut size={18} />
        {!compact && <span className="font-semibold">Log out</span>}
      </button>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
        title="Log Out"
        description="Are you sure you want to log out of your account?"
        confirmText="Log Out"
        isDestructive={true}
        isPending={isPending}
      />
    </>
  );
}
