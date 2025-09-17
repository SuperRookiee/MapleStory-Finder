"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth, isGuestAccessiblePath, isUnauthenticatedAccessiblePath } from "@/providers/AuthProvider";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const { isLoading, status } = useAuth();
    const pathname = usePathname();

    const guestAccessible = pathname ? isGuestAccessiblePath(pathname) : false;
    const unauthAccessible = pathname ? isUnauthenticatedAccessiblePath(pathname) : false;

    const renderSkeleton = () => (
        <div className="flex h-screen flex-col">
            <Skeleton className="h-[var(--header-height)] w-full" />
            <div className="flex-1 w-full overflow-hidden p-4">
                <Skeleton className="h-full w-full" />
            </div>
        </div>
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
        <main className="flex h-screen flex-col">
            <Header />
            <main className="h-[calc(100vh-var(--header-height))] w-full flex-1 overflow-hidden p-4">
                {children}
            </main>
        </main>
    );
};

export default MainLayout;

