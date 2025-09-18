'use client'

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import CharacterCard from "@/components/character/CharacterCard";
import CharacterCardSkeleton from "@/components/character/CharacterCardSkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ICharacterSummary } from "@/interface/character/ICharacterSummary";
import { useTranslations } from "@/providers/LanguageProvider";
import { cn } from "@/utils/utils";

interface IFavoriteListProps {
    favorites: ICharacterSummary[];
    loading: boolean;
    onSelect: (ocid: string) => void;
    onToggleFavorite: (ocid: string) => void;
    selected?: string | null;
    className?: string;
}

const FavoriteList = ({
    favorites,
    loading,
    onSelect,
    onToggleFavorite,
    selected,
    className,
}: IFavoriteListProps) => {
    const panelRef = useRef<HTMLDivElement | null>(null);
    const t = useTranslations();
    const hasFavorites = favorites.length > 0;

    useEffect(() => {
        const context = gsap.context(() => {
            gsap.fromTo(
                panelRef.current,
                { y: 24, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.65, ease: "power3.out" },
            );
        }, panelRef);
        return () => context.revert();
    }, []);

    useEffect(() => {
        if (loading) return;
        const context = gsap.context(() => {
            const items = gsap.utils.toArray<HTMLElement>(".favorite-card");
            if (!items.length) return;
            gsap.fromTo(
                items,
                { y: 18, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.08 },
            );
        }, panelRef);
        return () => context.revert();
    }, [favorites, loading]);

    const totalLabel = useMemo(
        () =>
            new Intl.NumberFormat(undefined, {
                notation: "standard",
            }).format(favorites.length),
        [favorites.length],
    );

    return (
        <div
            ref={panelRef}
            className={cn(
                "relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-xl",
                "backdrop-blur-xl",
                className,
            )}
            style={{
                background:
                    "linear-gradient(160deg, color-mix(in srgb, var(--card) 88%, transparent) 0%, color-mix(in srgb, var(--background) 94%, transparent) 60%, color-mix(in srgb, var(--primary) 10%, transparent) 100%)",
            }}
        >
            <div className="pointer-events-none absolute inset-0">
                <div
                    className="absolute -left-24 top-20 h-56 w-56 rounded-full blur-3xl"
                    style={{
                        background:
                            "radial-gradient(circle, color-mix(in srgb, var(--primary) 45%, transparent) 0%, transparent 70%)",
                        opacity: 0.55,
                    }}
                />
                <div
                    className="absolute -bottom-16 right-0 h-64 w-64 rounded-full blur-3xl"
                    style={{
                        background:
                            "radial-gradient(circle, color-mix(in srgb, var(--primary) 30%, transparent) 0%, transparent 70%)",
                        opacity: 0.4,
                    }}
                />
            </div>

            <div className="relative z-10 border-b border-border px-6 pb-5 pt-6">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                    {t('home.dashboard.label')}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                    {t('home.dashboard.list.title')}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    {t('home.dashboard.list.description')}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                    <span>{t('home.dashboard.list.totalLabel')}</span>
                    <span className="text-lg tracking-normal text-foreground">{totalLabel}</span>
                </div>
            </div>

            <ScrollArea className="relative z-10 flex-1 px-6 pb-6 pt-4">
                <div className="space-y-4">
                    {loading
                        ? Array.from({ length: 3 }).map((_, i) => <CharacterCardSkeleton key={i} />)
                        : hasFavorites ? (
                              favorites.map((c) => (
                                  <CharacterCard
                                      key={c.ocid}
                                      character={c}
                                      isFavorite
                                      className={cn(
                                          "border border-border bg-background shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl",
                                          selected === c.ocid && "ring-2 ring-primary shadow-xl",
                                      )}
                                      onToggleFavorite={() => onToggleFavorite(c.ocid)}
                                      onSelect={() => onSelect(c.ocid)}
                                  />
                              ))
                          ) : (
                              <div
                                  className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background p-6 text-center text-sm text-muted-foreground"
                                  style={{
                                      background:
                                          "linear-gradient(180deg, color-mix(in srgb, var(--background) 92%, transparent) 0%, color-mix(in srgb, var(--background) 86%, transparent) 100%)",
                                  }}
                              >
                                  {t('home.dashboard.list.empty')}
                              </div>
                          )}
                </div>
            </ScrollArea>
        </div>
    );
};

export default FavoriteList;
