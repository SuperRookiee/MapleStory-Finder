'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader as SheetContentHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
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

  if (pathname === "/sign_in" || pathname === "/sign_up") {
    return null;
  }

  return (
    <header className="flex items-center justify-between border-b p-4">
      <div>{email ?? "Guest"}</div>
      <div className="flex items-center space-x-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
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
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

