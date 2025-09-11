'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import SideMenu from "@/components/SideMenu";

export default function Header() {
    const pathname = usePathname();
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setEmail(data.user?.email ?? null);
        });
    }, []);


    if (pathname === "/sign_in" || pathname === "/sign_up") {
        return null;
    }

    return (
        <header className="flex items-center justify-between border-b px-4 py-2">
            <div>{email ?? "Guest"}</div>
            <div className="flex items-center space-x-2">
                <SideMenu/>
            </div>
        </header>
    );
}

