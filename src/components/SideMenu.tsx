"use client";

import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader as SheetContentHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/providers/AuthProvider";

const SideMenu = () => {
    const router = useRouter();
    const { status, logout } = useAuth();
    const isGuest = status === "guest";

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

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
                <div className="mt-4 space-y-2">
                    {!isGuest ? (
                        <SheetClose asChild>
                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={() => router.push("/home")}
                            >
                                Home
                            </Button>
                        </SheetClose>
                    ) : null}
                    <SheetClose asChild>
                        <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => router.push("/search")}
                        >
                            Search
                        </Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => router.push("/notice")}
                        >
                            Notice
                        </Button>
                    </SheetClose>
                    {!isGuest ? (
                        <SheetClose asChild>
                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={() => router.push("/character_list")}
                            >
                                Character List
                            </Button>
                        </SheetClose>
                    ) : null}
                    <SheetClose asChild>
                        <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => router.push("/chat")}
                        >
                            Finder Chat
                        </Button>
                    </SheetClose>
                    {!isGuest ? (
                        <SheetClose asChild>
                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={() => router.push("/my_page")}
                            >
                                My Page
                            </Button>
                        </SheetClose>
                    ) : null}
                    {status !== "unauthenticated" ? (
                        <SheetClose asChild>
                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={handleLogout}
                            >
                                {status === "guest" ? "Exit Guest" : "Logout"}
                            </Button>
                        </SheetClose>
                    ) : null}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default SideMenu;
