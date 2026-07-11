import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import Providers from '@/components/providers/Provider';
import ReduxProvider from '@/components/providers/ReduxProvider';
import ToastProvider from '@/components/providers/ToastProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Learnbit – Personal Task Manager, Habit Tracker & Productivity App',
  description:
    'Organize tasks, build lasting habits, track your progress, and stay productive with Learnbit. A clean, distraction-free personal productivity app designed to help you achieve your goals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeInitializer = `(() => {
    try {
      const key = 'learnbit-theme';
      const stored = localStorage.getItem(key);
      const theme = stored === 'light' || stored === 'dark'
        ? stored
        : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (_) {}
  })();`;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializer }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ReduxProvider>
          <Providers>
            <ThemeProvider>{children}</ThemeProvider>
            <ToastProvider />
          </Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}
