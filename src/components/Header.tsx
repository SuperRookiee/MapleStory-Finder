'use client';

import { usePathname } from "next/navigation";
import SideMenu from "@/components/SideMenu";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
    const pathname = usePathname();
    if (pathname === "/sign_in" || pathname === "/sign_up") return null;

    return (
        <header className="sticky top-0 z-50 flex h-[var(--header-height)] items-center justify-between border-b bg-neutral-800/90 px-4">
            {/* 로고 */}
            <Link href="/" className="flex items-center">
                <Image
                    src="/Reheln.png"
                    alt="Finder"
                    width={40}
                    height={40}
                    priority
                />
            </Link>
            {/* 오른쪽 메뉴 */}
            <div className="flex items-center space-x-2">
                <SideMenu />
            </div>
        </header>
    );
};

export default Header;