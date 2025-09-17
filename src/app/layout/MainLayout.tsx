"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import BackgroundPattern from "@/components/layouts/BackgroundPattern";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth, isGuestAccessiblePath, isUnauthenticatedAccessiblePath } from "@/providers/AuthProvider";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const { isLoading, status } = useAuth();
    const pathname = usePathname();

    const guestAccessible = pathname ? isGuestAccessiblePath(pathname) : false;
    const unauthAccessible = pathname ? isUnauthenticatedAccessiblePath(pathname) : false;

    const renderSkeleton = () => (
        <BackgroundPattern>
            <header className="sticky top-0 z-50 border-b border-border/60 bg-card/80 backdrop-blur">
                <div className="mx-auto flex h-[var(--header-height)] w-full max-w-6xl items-center px-4 sm:px-6 lg:px-8">
                    <Skeleton className="h-10 w-full" />
                </div>
            </header>
            <div className="flex flex-1">
                <div className="mx-auto flex h-full min-h-[calc(100vh-var(--header-height))] w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex h-full w-full flex-1 flex-col overflow-hidden rounded-[32px] border border-border/60 bg-card/80 p-6 shadow-[0_40px_80px_-50px_rgba(15,23,42,0.45)] backdrop-blur-md">
                        <Skeleton className="h-full w-full" />
                    </div>
                </div>
            </div>
        </BackgroundPattern>
    );

    if (isLoading) {
        return renderSkeleton();
    }

    if (status === "guest" && !guestAccessible) {
        return renderSkeleton();
    }

    if (status === "unauthenticated" && !unauthAccessible) {
        return renderSkeleton();
    }

    return (
        <BackgroundPattern>
            <Header />
            <div className="flex flex-1">
                <div className="mx-auto flex h-full min-h-[calc(100vh-var(--header-height))] w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex h-full w-full flex-1 flex-col overflow-hidden rounded-[32px] border border-border/60 bg-card/80 p-6 shadow-[0_40px_80px_-50px_rgba(15,23,42,0.45)] backdrop-blur-md">
                        {children}
                    </div>
                </div>
            </div>
        </BackgroundPattern>
    );
};

export default MainLayout;

