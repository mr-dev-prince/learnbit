'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--surface)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
          borderRadius: '1rem',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: 500,
          boxShadow: '0 8px 32px -8px var(--shadow-color)',
        },
        success: {
          iconTheme: {
            primary: 'var(--completed-text)',
            secondary: 'var(--surface)',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: 'var(--surface)',
          },
        },
      }}
    />
  );
}
