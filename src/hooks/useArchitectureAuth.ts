'use client';

import { useState, useEffect, useCallback } from 'react';

const PIN_STORAGE_KEY = 'learnbit_arch_pin';
const UNLOCKED_STORAGE_KEY = 'learnbit_arch_unlocked';
const DEFAULT_PIN = '1234';

export function useArchitectureAuth() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    try {
      const unlocked = sessionStorage.getItem(UNLOCKED_STORAGE_KEY) === 'true';
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsUnlocked(unlocked);
    } catch {
      // Ignore
    }
    setIsMounted(true);
  }, []);

  const getStoredPin = useCallback((): string => {
    try {
      return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
    } catch {
      return DEFAULT_PIN;
    }
  }, []);

  const unlock = useCallback(
    (enteredPin: string): boolean => {
      const stored = getStoredPin();
      if (enteredPin.trim() === stored.trim()) {
        try {
          sessionStorage.setItem(UNLOCKED_STORAGE_KEY, 'true');
        } catch {
          // Ignored
        }
        setIsUnlocked(true);
        return true;
      }
      return false;
    },
    [getStoredPin],
  );

  const lock = useCallback(() => {
    try {
      sessionStorage.removeItem(UNLOCKED_STORAGE_KEY);
    } catch {
      // Ignored
    }
    setIsUnlocked(false);
  }, []);

  const changePin = useCallback(
    (oldPin: string, newPin: string): { success: boolean; message: string } => {
      const stored = getStoredPin();
      if (oldPin.trim() !== stored.trim()) {
        return { success: false, message: 'Current password/PIN is incorrect.' };
      }
      if (!newPin || newPin.trim().length < 4) {
        return { success: false, message: 'New password/PIN must be at least 4 characters.' };
      }
      try {
        localStorage.setItem(PIN_STORAGE_KEY, newPin.trim());
        return { success: true, message: 'Password/PIN updated successfully.' };
      } catch {
        return { success: false, message: 'Could not save new password to storage.' };
      }
    },
    [getStoredPin],
  );

  const resetToDefault = useCallback(() => {
    try {
      localStorage.removeItem(PIN_STORAGE_KEY);
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    isUnlocked,
    isMounted,
    unlock,
    lock,
    changePin,
    resetToDefault,
    defaultPin: DEFAULT_PIN,
  };
}
