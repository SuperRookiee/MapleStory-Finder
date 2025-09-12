"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/libs/supabaseClient";
import Header from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { userStore } from "@/stores/userStore";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const setApiKey = userStore((s) => s.setApiKey);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        router.replace("/sign_in");
        return;
      }
      const key = session.user.user_metadata?.nexon_api_key;
      if (key) setApiKey(key);
      setLoading(false);
    };
    checkAuth();
  }, [router, setApiKey]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <Skeleton className="h-[var(--header-height)] w-full" />
        <div className="flex-1 p-4 overflow-hidden w-full">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

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

