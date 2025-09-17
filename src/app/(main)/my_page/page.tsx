'use client';

import { useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { userStore } from '@/stores/userStore';
import { supabase } from '@/libs/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

const FormSkeleton = () => (
  <div className="flex justify-center p-4">
    <div className="w-full max-w-sm space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  </div>
);

const PageContent = () => {
  const setApiKey = userStore((s) => s.setApiKey);
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    apiKey: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (searchParams.get('missingApiKey')) {
      toast.info('apikey 등록이 필요합니다.');
    }
  }, [searchParams]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (user) {
        setForm((f) => ({
          ...f,
          name: user.user_metadata?.name ?? '',
          email: user.email ?? '',
          apiKey: user.user_metadata?.nexon_api_key ?? '',
        }));
      }
      setInitialLoading(false);
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const updates: {
      email?: string;
      password?: string;
      data: { name: string; nexon_api_key: string };
    } = {
      data: { name: form.name, nexon_api_key: form.apiKey },
    };
    if (form.email) updates.email = form.email;
    if (form.password) updates.password = form.password;
    const { error } = await supabase.auth.updateUser(updates);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Profile updated');
      setApiKey(form.apiKey);
    }
    setLoading(false);
  };

  if (initialLoading) return <FormSkeleton />;

  return (
    <div className="flex justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
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
            placeholder="Leave blank to keep current password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            value={form.apiKey}
            onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </div>
  );
};

const MyPage = () => (
  <Suspense fallback={<FormSkeleton />}> 
    <PageContent />
  </Suspense>
);

export default MyPage;

