'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { state: { auth } } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !auth.isLoading && !auth.isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isClient, auth.isLoading, auth.isAuthenticated, pathname, router]);

  if (!isClient || auth.isLoading) return null;

  if (!auth.isAuthenticated && pathname !== '/login') {
    return null;
  }

  return <>{children}</>;
}
