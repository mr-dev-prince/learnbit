'use client';

import React, { useState } from 'react';
import { KeyRound, X, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useArchitectureAuth } from '@/hooks/useArchitectureAuth';

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePinModal({ isOpen, onClose }: ChangePinModalProps) {
  const { changePin } = useArchitectureAuth();
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPin !== confirmPin) {
      setError('New passwords do not match');
      return;
    }

    if (newPin.length < 4) {
      setError('New password must be at least 4 characters');
      return;
    }

    const result = changePin(currentPin, newPin);
    if (result.success) {
      toast.success('Architecture vault password updated!');
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      onClose();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-surface border border-border rounded-xl shadow-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <KeyRound size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Change Vault Password</h3>
              <p className="text-xs text-text-muted">Update your PIN/password for the Architecture Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">
              Current Password / PIN
            </label>
            <input
              type="password"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              placeholder="Enter current password (default: 1234)"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface-muted/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">
              New Password / PIN
            </label>
            <input
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Enter new password (min 4 characters)"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface-muted/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="Confirm new password"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface-muted/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-text-muted hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all"
            >
              <Check size={16} />
              Save Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
