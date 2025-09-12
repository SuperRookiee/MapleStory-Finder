'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { supabase } from '@/libs/supabaseClient';
import Header from '@/components/Header';
import { userStore } from '@/stores/userStore';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const setApiKey = userStore((s) => s.setApiKey);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        router.replace('/sign_in');
        return;
      }
      const key = session.user.user_metadata?.nexon_api_key;
      if (key) setApiKey(key);
    };
    checkAuth();
  }, [router, setApiKey]);

  return (
        <main className="flex flex-col h-screen">
            <Header />
            <main className="flex-1 p-4 overflow-hidden w-full h-[calc(100vh-var(--header-height))]">
                {children}
            </main>
        </main>
  );
};

export default MainLayout;

