'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DarkModeToggle from '@/components/DarkModeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import SideMenu from '@/components/SideMenu';
import { useAuth } from '@/providers/AuthProvider';

const Header = () => {
  const pathname = usePathname();
  const { status, isGuest } = useAuth();
  if (pathname === '/sign_in' || pathname === '/sign_up') return null;

  const logoHref = isGuest || status === 'unauthenticated' ? '/search' : '/home';

  return (
    <header className="sticky top-0 z-50 flex h-[var(--header-height)] items-center justify-between border-b bg-background/90 px-4">
      {/* 로고 */}
      <Link href={logoHref} className="flex items-center">
        <Image src="/Reheln.png" alt="Finder" width={40} height={40} priority />
      </Link>
      {/* 오른쪽 메뉴 */}
      <div className="flex items-center">
        <LanguageToggle />
        <DarkModeToggle />
        <SideMenu />
      </div>
    </header>
  );
};

export default Header;

