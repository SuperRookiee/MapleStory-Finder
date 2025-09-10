'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useApiKeyStore } from '@/store/apiKeyStore';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Label } from '@/component/ui/label';
import { toast } from 'sonner';

export default function SignUpPage() {
  const router = useRouter();
  const setApiKey = useApiKeyStore((s) => s.setApiKey);
  const [form, setForm] = useState({ email: '', password: '', apiKey: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { nexon_api_key: form.apiKey } },
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
          src="https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80"
          alt="Cover"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Sign Up</h1>
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
          <div className="space-y-2">
            <Label htmlFor="apiKey">Nexon API Key</Label>
            <Input
              id="apiKey"
              value={form.apiKey}
              onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Create account
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={handleGoogle}>
            Sign up with Google
          </Button>
          <p className="text-sm text-center">
            Already have an account?{' '}
            <Link href="/signin" className="underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
