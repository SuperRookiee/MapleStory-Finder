'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { supabase } from '@/libs/supabaseClient';
import Header from '@/components/Header';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace('/sign_in');
      }
    };
    checkAuth();
  }, [router]);

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

