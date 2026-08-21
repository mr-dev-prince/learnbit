'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, KeyRound, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useArchitectureAuth } from '@/hooks/useArchitectureAuth';

interface PasswordGateProps {
  children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const { isUnlocked, isMounted, unlock, resetToDefault } = useArchitectureAuth();
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] px-4">
        <div className="w-full max-w-md bg-surface/70 border border-border rounded-2xl p-8 backdrop-blur-md animate-pulse">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-surface-muted border border-border" />
            <div className="h-6 w-48 rounded-md bg-surface-muted" />
            <div className="h-4 w-64 rounded-md bg-surface-muted" />
            <div className="h-12 w-full rounded-xl bg-surface-muted mt-4" />
            <div className="h-10 w-full rounded-xl bg-surface-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    const success = unlock(pin);
    if (success) {
      toast.success('Architecture Vault unlocked');
      setErrorMessage('');
    } else {
      setIsShaking(true);
      setErrorMessage('Incorrect password. Default PIN is 1234');
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  const handleReset = () => {
    if (confirm('Reset vault password back to default (1234)?')) {
      resetToDefault();
      toast.success('Password reset to default (1234)');
      setErrorMessage('');
      setPin('1234');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 animate-fadeIn">
      <div
        className={`w-full max-w-md bg-surface/90 border border-border rounded-2xl shadow-xl p-8 backdrop-blur-xl transition-transform duration-200 ${
          isShaking ? 'animate-bounce' : ''
        }`}
      >
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-primary/20 via-primary/10 to-transparent flex items-center justify-center text-primary shadow-inner border border-primary/20">
              <Lock size={32} className="text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-surface rounded-full border border-border text-secondary">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Architecture Vault
            </h2>
            <p className="text-sm text-text-muted mt-1 max-w-xs mx-auto">
              This repository of system designs and blueprints is password protected.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleUnlock} className="mt-8 space-y-4">
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Enter password or PIN..."
                autoFocus
                className="w-full pl-11 pr-11 py-3 bg-surface-muted/60 border border-border rounded-xl text-foreground placeholder:text-text-subtle text-base font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-center"
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                <KeyRound size={18} />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground transition-colors p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errorMessage && (
              <p className="text-xs text-red-500 font-medium text-center mt-2 animate-fadeIn">
                {errorMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white font-semibold rounded-xl shadow-md hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>Unlock Vault</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Helper footer */}
        <div className="mt-6 pt-5 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-2">
          <div className="flex items-center gap-1.5 text-text-subtle">
            <Sparkles size={14} className="text-primary" />
            <span>Default PIN: <strong className="text-foreground">1234</strong></span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="hover:text-primary transition-colors cursor-pointer underline underline-offset-2"
          >
            Forgot or reset?
          </button>
        </div>
      </div>
    </div>
  );
}
