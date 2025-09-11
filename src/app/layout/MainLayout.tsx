'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
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
          <main className="flex-1" style={{ height: 'calc(100vh - 3rem)' }}>
              {children}
          </main>
      </main>
  );
};

export default MainLayout;

