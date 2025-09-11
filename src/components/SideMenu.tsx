import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader as SheetContentHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

const SideMenu = () => {
    const router = useRouter();
    const setUser = useUserStore((s) => s.setUser);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser({ apiKey: null });
        router.push("/sign_in");
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-transparent">
                    <Menu className='text-white'/>
                </Button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetContentHeader>
                    <SheetTitle>Finder</SheetTitle>
                    <SheetDescription>menu</SheetDescription>
                </SheetContentHeader>
                <div className="mt-4 space-y-2">
                    <SheetClose asChild>
                        <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => router.push("/")}
                        >
                            Home
                        </Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => router.push("/character_list")}
                        >
                            Character List
                        </Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => router.push("/my_page")}
                        >
                            My Page
                        </Button>
                    </SheetClose>
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
    );
};

export default SideMenu;
