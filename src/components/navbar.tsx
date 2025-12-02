'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/workouts', label: 'Workouts', icon: '💪' },
  { href: '/goals', label: 'Goals', icon: '🎯' },
  { href: '/trainers', label: 'Trainers', icon: '🏋️' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-orange-500/25 transition-shadow">
              F
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              FitLife
            </span>
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === item.href
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
