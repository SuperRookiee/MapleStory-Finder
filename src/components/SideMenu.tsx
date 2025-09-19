"use client";

import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
    Bell,
    Box,
    Home,
    LogOut,
    Menu,
    MessageSquare,
    Search,
    Sparkles,
    UserCircle,
    Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader as SheetContentHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/providers/AuthProvider";

type MenuItem = {
    href: string;
    label: string;
    icon: LucideIcon;
    hideForGuest?: boolean;
    requiresAuth?: boolean;
};

const menuItems: MenuItem[] = [
    { href: "/home", label: "Home", icon: Home, hideForGuest: true },
    { href: "/search", label: "Search", icon: Search },
    { href: "/notice", label: "Notice", icon: Bell },
    { href: "/character_list", label: "Character List", icon: Users, hideForGuest: true },
    { href: "/chat", label: "Finder Chat", icon: MessageSquare },
    { href: "/starforce", label: "Starforce History", icon: Sparkles, requiresAuth: true },
    { href: "/cube", label: "Cube History", icon: Box, requiresAuth: true },
    { href: "/my_page", label: "My Page", icon: UserCircle, hideForGuest: true },
];

const SideMenu = () => {
    const router = useRouter();
    const { status, isGuest, isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    const availableItems = menuItems.filter((item) => {
        if (item.requiresAuth && !isAuthenticated) {
            return false;
        }
        if (item.hideForGuest && isGuest) {
            return false;
        }
        return true;
    });

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-transparent">
                    <Menu className="text-foreground" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetContentHeader>
                    <SheetTitle>Finder</SheetTitle>
                    <SheetDescription>menu</SheetDescription>
                </SheetContentHeader>
                <div className="mt-2 space-y-2">
                    {availableItems.map((item) => (
                        <SheetClose asChild key={item.href}>
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3"
                                onClick={() => router.push(item.href)}
                            >
                                <item.icon className="h-4 w-4" aria-hidden="true" />
                                <span>{item.label}</span>
                            </Button>
                        </SheetClose>
                    ))}
                    {status !== "unauthenticated" ? (
                        <SheetClose asChild>
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" aria-hidden="true" />
                                <span>{status === "guest" ? "Exit Guest" : "Logout"}</span>
                            </Button>
                        </SheetClose>
                    ) : null}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default SideMenu;
