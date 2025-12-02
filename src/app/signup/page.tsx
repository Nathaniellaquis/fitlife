'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function SignupPage() {
  const router = useRouter();
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fname, lname, email, password }),
      });

      if (res.ok) {
        toast.success('Account created! Welcome to FitLife!');
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to create account');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-purple-500/10 p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4">
            F
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Join FitLife
          </CardTitle>
          <p className="text-muted-foreground mt-2">Start your fitness journey today</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fname">First Name</Label>
                <Input
                  id="fname"
                  placeholder="John"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lname">Last Name</Label>
                <Input
                  id="lname"
                  placeholder="Doe"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-orange-500 hover:text-orange-600 font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
