"use client";

import Image from "next/image";
import Link from "next/link";
import { unstable_ViewTransition as ViewTransition } from "react";
import { ArrowRight, BarChart3, Bot, type LucideIcon, Search, ShieldCheck, Sparkles, Wand2, } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";
import { useTranslations } from "@/providers/LanguageProvider";

const Page = () => {
    const t = useTranslations();
    const { isAuthenticated } = useAuth();
    const primaryCtaHref = isAuthenticated ? "/home" : "/sign_in";
    return (
        <ViewTransition enter="fade" exit="fade">
            <div className='absolute top-1 right-1 z-10 flex gap-1.5'>
                <LanguageToggle />
                <DarkModeToggle />
            </div>
            <main className="bg-background text-foreground">
                <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-16 px-4 pb-16 pt-12 sm:px-6 lg:px-8 space-y-6">
                    <section className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
                        <div className="space-y-6">
                            <div
                                className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/70 px-4 py-1 text-xs font-medium uppercase tracking-[0.32em] text-muted-foreground">
                                <Image
                                    src="/images/reheln/Reheln.png"
                                    alt={t('common.appName')}
                                    className="object-contain"
                                    width={20}
                                    height={20}
                                    priority
                                />
                                {t('common.appName')}
                            </div>
                            <h1 className="text-balance text-4xl font-semibold leading-tight break-keep tracking-tight sm:text-5xl">
                                {t('landing.hero.title')}
                            </h1>
                            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg mb-10">
                                {t('landing.hero.description')}
                            </p>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button asChild className="gap-2">
                                    <Link href={primaryCtaHref}>
                                        {t('landing.hero.ctaPrimary')}
                                        <ArrowRight className="h-4 w-4"/>
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="gap-2">
                                    <Link href="/search">
                                        {t('landing.hero.ctaSecondary')}
                                        <Search className="h-4 w-4"/>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        {/* 미리보기 */}
                        <Card className="h-full border-border/70 bg-card/90 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex gap-2 items-baseline">
                                    <Sparkles className="h-4 w-4 text-primary mb-0.5"/> {t('landing.preview.title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('landing.preview.description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-6 pb-8">
                                <div className="relative mx-auto aspect-square w-40 overflow-hidden rounded-2xl bg-muted sm:w-56">
                                    <Image
                                        src="/images/preview/character_detail.png"
                                        alt={t('common.appName')}
                                        fill
                                        className="object-contain px-2 block dark:hidden"
                                        sizes="(max-width: 768px) 10rem, 14rem"
                                        priority
                                    />
                                    <Image
                                        src="/images/preview/character_detail_dark.png"
                                        alt={t('common.appName')}
                                        fill
                                        className="object-contain px-2 hidden dark:block"
                                        sizes="(max-width: 768px) 10rem, 14rem"
                                        priority
                                    />
                                </div>
                                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                                    {PREVIEW_CARDS.map(({ key }) => (
                                        <div
                                            key={key}
                                            className="rounded-lg border border-dashed border-border/70 bg-background/70 p-4 transition-transform duration-300 ease-out hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/20"
                                        >
                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
                                                {t(`landing.preview.cards.${key}.label`)}
                                            </p>
                                            <p className="mt-1 text-base font-semibold text-foreground">
                                                {t(`landing.preview.cards.${key}.title`)}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {t(`landing.preview.cards.${key}.description`)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {HIGHLIGHTS.map(({ key, Icon }) => (
                            <Card
                                key={key}
                                className="border-border/70 transition-transform duration-300 ease-out hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/20"
                            >
                                <CardContent className="flex flex-col gap-4 py-6">
                                    <Icon className="h-10 w-10 text-primary" strokeWidth={1.6}/>
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {t(`landing.highlights.${key}.title`)}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t(`landing.highlights.${key}.description`)}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </section>

                    <section className="grid gap-4 md:grid-cols-2">
                        {QUICK_LINKS.map(({ key, href, Icon }) => (
                            <Card key={key} className="border-border/70 bg-muted/40">
                                <CardContent className="flex h-full flex-col gap-4 py-6">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-foreground">
                                                {t(`landing.quickLinks.${key}.title`)}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {t(`landing.quickLinks.${key}.description`)}
                                            </p>
                                        </div>
                                        <Icon className="h-5 w-5 text-primary" strokeWidth={1.6}/>
                                    </div>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="w-fit gap-2 px-0 text-sm font-semibold text-primary hover:bg-transparent hover:text-primary"
                                    >
                                        <Link href={href}>
                                            {t(`landing.quickLinks.${key}.cta`)}
                                            <ArrowRight className="h-4 w-4"/>
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </section>
                </div>
            </main>
        </ViewTransition>
    );
};

type PreviewCard = {
    key: "character" | "insight";
};

type Feature = {
    key: "search" | "stats" | "equipment";
    Icon: LucideIcon;
};

type QuickLink = {
    key: "chat" | "figure";
    href: string;
    Icon: LucideIcon;
};

const PREVIEW_CARDS: PreviewCard[] = [
    { key: "character" },
    { key: "insight" },
];

const HIGHLIGHTS: Feature[] = [
    {
        key: "search",
        Icon: Search,
    },
    {
        key: "stats",
        Icon: BarChart3,
    },
    {
        key: "equipment",
        Icon: ShieldCheck,
    },
];

const QUICK_LINKS: QuickLink[] = [
    {
        key: "chat",
        href: "/chat",
        Icon: Bot,
    },
    {
        key: "figure",
        href: "/figure",
        Icon: Wand2,
    },
];

export default Page;
