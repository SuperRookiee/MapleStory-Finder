"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Home, Search, Sparkles } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/providers/LanguageProvider";

const SUGGESTIONS = [
    {
        key: "landing" as const,
        href: "/",
        Icon: Compass,
    },
    {
        key: "search" as const,
        href: "/search",
        Icon: Search,
    },
    {
        key: "favorites" as const,
        href: "/home",
        Icon: Sparkles,
    },
] as const;

const NotFound = () => {
    const t = useTranslations();
    return (
        <main className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-background text-foreground">
            <div className="absolute right-3 top-3 z-20 flex gap-1.5 sm:right-6 sm:top-6">
                <LanguageToggle />
                <DarkModeToggle />
            </div>

            <div
                aria-hidden
                className="pointer-events-none absolute -left-1/3 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle_at_center,_rgba(132,90,223,0.18),_transparent_65%)] blur-2xl dark:bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.22),_transparent_70%)]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-36 right-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.12),_transparent_65%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,_rgba(190,18,60,0.18),_transparent_70%)]"
            />

            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-12 px-4 py-20 text-center sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute -inset-10 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20" />
                        <Image
                            src="/Reheln.png"
                            alt={t('common.appName')}
                            width={112}
                            height={112}
                            className="relative z-10 h-24 w-24 rounded-3xl border border-border/60 bg-background/90 p-4 shadow-lg shadow-primary/20 backdrop-blur"
                        />
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-1 text-xs font-medium uppercase tracking-[0.32em] text-muted-foreground">
                        404 Not Found
                    </span>
                    <div className="space-y-4 sm:space-y-5">
                        <h1 className="text-pretty text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                            {t('notFound.title')}
                        </h1>
                        <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
                            {t('notFound.description')}
                        </p>
                    </div>
                </div>

                <div className="grid w-full gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
                    {SUGGESTIONS.map(({ key, href, Icon }) => (
                        <Card key={key} className="border-border/60 bg-background/80 backdrop-blur">
                            <CardHeader className="gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-muted/60">
                                        <Icon className="h-5 w-5 text-primary" strokeWidth={1.8} />
                                    </span>
                                    <CardTitle className="text-base font-semibold text-foreground">
                                        {t(`notFound.suggestions.${key}.title`)}
                                    </CardTitle>
                                </div>
                                <CardDescription className="leading-relaxed text-sm text-muted-foreground">
                                    {t(`notFound.suggestions.${key}.description`)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="gap-2 px-0 text-sm font-semibold text-primary hover:bg-transparent hover:text-primary"
                                >
                                    <Link href={href}>
                                        {t(`notFound.suggestions.${key}.cta`)}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button asChild className="gap-2">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            {t('notFound.actions.home')}
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/search">
                            <Search className="h-4 w-4" />
                            {t('notFound.actions.search')}
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    );
};

export default NotFound;
