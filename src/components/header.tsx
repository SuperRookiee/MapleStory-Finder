'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader as SheetContentHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function Header() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser({ apiKey: null });
    router.push("/sign_in");
  };

  return (
    <header className="flex items-center justify-between border-b p-4">
      <div>{email ?? "Guest"}</div>
      <div className="flex items-center space-x-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Menu</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetContentHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetContentHeader>
            <div className="mt-4 space-y-2">
              <Button variant="ghost" className="w-full">
                Menu Item 1
              </Button>
              <Button variant="ghost" className="w-full">
                Menu Item 2
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </header>
  );
}

