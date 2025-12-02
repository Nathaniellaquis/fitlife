'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';

const authPages = ['/login', '/signup'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </>
  );
}
