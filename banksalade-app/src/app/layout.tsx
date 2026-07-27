import type { Metadata } from 'next';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppProvider } from '@/context/AppContext';
import Navigation from '@/components/layout/Navigation';
import ErrorBoundary from '@/components/layout/ErrorBoundary';
import NotificationContainer from '@/components/ui/NotificationContainer';
import AuthGuard from '@/components/layout/AuthGuard';
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
              <AuthGuard>
                <div className="flex min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
                  <Navigation />
                  <main className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64">
                    {children}
                  </main>
                </div>
                <NotificationContainer />
              </AuthGuard>
            </ErrorBoundary>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
