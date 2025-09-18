"use client";

import Link from "next/link";
import { WifiOff } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/providers/LanguageProvider";

const OfflineContent = () => {
    const t = useTranslations();

    const handleRetry = () => {
        if (typeof window !== "undefined") {
            window.location.reload();
        }
    };

    return (
        <main className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-background text-foreground">
            <div className="absolute right-3 top-3 z-20 flex gap-1.5 sm:right-6 sm:top-6">
                <LanguageToggle />
                <DarkModeToggle />
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-10 px-6 py-20 text-center sm:gap-12">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-border/60 bg-muted/60">
                    <WifiOff className="h-8 w-8 text-primary" strokeWidth={1.8} />
                </span>

                <div className="space-y-4">
                    <h1 className="text-pretty text-3xl font-semibold tracking-tight sm:text-4xl">
                        {t("offline.title")}
                    </h1>
                    <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {t("offline.description")}
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button variant="outline" onClick={handleRetry} className="px-6">
                        {t("offline.actions.retry")}
                    </Button>
                    <Button asChild className="px-6">
                        <Link href="/">{t("common.backToHome")}</Link>
                    </Button>
                </div>
            </div>
        </main>
    );
};

export default OfflineContent;
