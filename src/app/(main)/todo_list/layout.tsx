"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/providers/LanguageProvider";
import { cn } from "@/utils/utils";

const NAV_ITEMS = [
    {
        href: "/todo_list",
        labelKey: "todoList.navigation.overview",
        icon: CalendarCheck,
    },
    {
        href: "/todo_list/dashboard",
        labelKey: "todoList.navigation.dashboard",
        icon: BarChart3,
    },
] as const;

const TodoListLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const t = useTranslations();

    return (
        <div className="flex h-full w-full flex-col">
            <div className="flex-1 overflow-auto">
                <div className="flex min-h-full flex-col gap-6 pb-6">
                    <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-background p-6 shadow-xl">
                        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-16 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="space-y-2">
                                <Badge variant="secondary" className="bg-primary/20 text-primary">
                                    {t("todoList.hero.badge")}
                                </Badge>
                                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                    {t("todoList.hero.title")}
                                </h1>
                                <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
                                    {t("todoList.hero.description")}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-primary/30 bg-background/90 px-4 py-3 text-sm text-primary shadow-sm">
                                {t("todoList.hero.resetInfo")}
                            </div>
                        </div>
                    </section>

                    <nav className="sticky top-0 z-20 flex flex-wrap gap-3 rounded-2xl border border-border/80 bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/75">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                                        active
                                            ? "border-primary/60 bg-primary text-primary-foreground shadow"
                                            : "border-border bg-background hover:border-primary/40 hover:text-primary",
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {t(item.labelKey)}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex flex-1 flex-col gap-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoListLayout;
