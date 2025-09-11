'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function SignInPage() {
  const router = useRouter();
  const setApiKey = useUserStore((s) => s.setApiKey);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    const apiKey = data.user?.user_metadata?.nexon_api_key;
    if (apiKey) {
      setApiKey(apiKey);
    }
    router.push('/');
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 md:block">
        <img
          src="https://lwi.nexon.com/maplestory/common/media/artwork/artwork_117.jpg"
          alt="Cover"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Sign In</h1>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={handleGoogle}>
            Sign in with Google
          </Button>
          <p className="text-sm text-center">
            Don&apos;t have an account?{' '}
            <Link href="/sign_up" className="underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
