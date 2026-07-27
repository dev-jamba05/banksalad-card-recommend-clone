import type { Metadata } from 'next';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppProvider } from '@/context/AppContext';
import Navigation from '@/components/layout/Navigation';
import ErrorBoundary from '@/components/layout/ErrorBoundary';
import NotificationContainer from '@/components/ui/NotificationContainer';
import './globals.css';

export const metadata: Metadata = {
  title: 'BankSalade — 나만의 금융 건강 코치',
  description: '나보다 나를 더 잘 아는 금융 건강 코치, 뱅크샐러드',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AppProvider>
            <ErrorBoundary>
              <Navigation />
              <main className="min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>
                {children}
              </main>
              <NotificationContainer />
            </ErrorBoundary>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
