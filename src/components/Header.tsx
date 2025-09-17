'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DarkModeToggle from '@/components/DarkModeToggle';
import SideMenu from '@/components/SideMenu';
import { useAuth } from '@/providers/AuthProvider';

const Header = () => {
    const pathname = usePathname();
    const { status, isGuest } = useAuth();
    if (pathname === '/sign_in' || pathname === '/sign_up') return null;

    const logoHref = isGuest || status === 'unauthenticated' ? '/search' : '/';

    return (
        <header className="sticky top-0 z-50 border-b border-border/60 bg-card/80 backdrop-blur">
            <div className="mx-auto flex h-[var(--header-height)] w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    href={logoHref}
                    aria-label="Finder 홈으로 이동"
                    className="group flex items-center gap-3 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-sm font-semibold text-foreground/90 transition hover:border-primary/40 hover:text-primary"
                >
                    <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 via-primary/30 to-primary/10 shadow-inner shadow-primary/20 transition group-hover:from-primary/60 group-hover:via-primary/40 group-hover:to-primary/20">
                        <Image src="/Reheln.png" alt="Finder" width={24} height={24} priority className="drop-shadow-sm" />
                    </span>
                    <span className="hidden text-base font-semibold tracking-tight md:inline-block">Finder</span>
                </Link>
                <div className="flex items-center gap-1.5">
                    <DarkModeToggle />
                    <SideMenu />
                </div>
            </div>
        </header>
    );
};

export default Header;

