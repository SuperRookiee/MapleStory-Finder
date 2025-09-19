'use client'

import { useRouter } from "next/navigation";
import { unstable_ViewTransition as ViewTransition, useEffect, useMemo, useState } from "react";
import { Bookmark, UserRound } from "lucide-react";
import { favoriteStore } from "@/stores/favoriteStore";
import { supabase } from "@/libs/supabaseClient";
import CharacterInfo from "@/components/home/CharacterInfo";
import FavoriteList from "@/components/home/FavoriteList";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { findCharacterBasic } from "@/fetchs/character.fetch";
import { addFavorite, getFavorites, removeFavorite } from "@/fetchs/favorite.fetch";
import { ICharacterSummary } from "@/interface/character/ICharacterSummary";
import { useTranslations } from "@/providers/LanguageProvider";

const Home = () => {
    const router = useRouter();
    const t = useTranslations();
    const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
    const [favorites, setFavorites] = useState<ICharacterSummary[]>([]);
    const { setFavorites: setFavoriteOcids, addFavorite: addFavoriteOcid, removeFavorite: removeFavoriteOcid } = favoriteStore();
    const [selected, setSelected] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const selectedCharacter = useMemo(
        () => favorites.find((favorite) => favorite.ocid === selected) ?? null,
        [favorites, selected],
    );
    const stats = useMemo(
        () => {
            const favoritesCount = favorites.length;
            const favoritesHelper = favoritesCount > 0
                ? t('home.stats.totalFavoritesHelper', { count: favoritesCount })
                : t('home.stats.totalFavoritesHelperEmpty');
            const selectedHelper = selectedCharacter
                ? `${selectedCharacter.character_class} · ${t('home.stats.level', {
                    level: selectedCharacter.character_level,
                })}`
                : t('home.stats.selectedHelper');

            return [
                {
                    key: 'favorites' as const,
                    label: t('home.stats.totalFavorites'),
                    value: favoritesCount.toLocaleString(),
                    helper: favoritesHelper,
                    Icon: Bookmark,
                    showSkeleton: loading,
                },
                {
                    key: 'selected' as const,
                    label: t('home.stats.selected'),
                    value: selectedCharacter?.character_name ?? t('home.stats.none'),
                    helper: selectedHelper,
                    Icon: UserRound,
                    showSkeleton: false,
                },
            ];
        },
        [favorites.length, loading, selectedCharacter, t],
    );

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const { data } = await supabase.auth.getSession();
            const session = data.session;
            if (!session) {
                setLoading(false);
                return;
            }
            setUser({ id: session.user.id, email: session.user.email ?? undefined });
            const favOcids = await getFavorites(session.user.id);
            setFavoriteOcids(favOcids);
            const chars = await Promise.all(
                favOcids.map(async (ocid) => {
                    const data = await findCharacterBasic(ocid);
                    return {
                        ocid,
                        character_name: data.data.character_name,
                        world_name: data.data.world_name,
                        character_class: data.data.character_class,
                        character_level: data.data.character_level,
                        image: data.data.character_image,
                    } as ICharacterSummary;
                })
            );
            setFavorites(chars);
            setLoading(false);
        };

        load();
    }, []);

    const toggleFavorite = async (ocid: string) => {
        if (!user) return;
        if (favorites.find((f) => f.ocid === ocid)) {
            await removeFavorite(user.id, ocid);
            setFavorites(favorites.filter((f) => f.ocid !== ocid));
            removeFavoriteOcid(ocid);
            if (selected === ocid) setSelected(null);
        } else {
            await addFavorite(user.id, ocid);
            const data = await findCharacterBasic(ocid);
            setFavorites([
                ...favorites,
                {
                    ocid,
                    character_name: data.data.character_name,
                    world_name: data.data.world_name,
                    character_class: data.data.character_class,
                    character_level: data.data.character_level,
                    image: data.data.character_image,
                },
            ]);
            addFavoriteOcid(ocid);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSelect = (ocid: string) => {
        setSelected(ocid);
        // 모바일일 경우 다이얼로그 열기
        if (window.innerWidth < 768) {
            setOpen(true);
        }
    };

    const goToDetailPage = () => {
        if (!selected) return;
        router.push(`/character/${selected}`);
    };

    return (
        <ViewTransition enter="fade" exit="fade">
            <ScrollArea className="h-page">
                <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col gap-6 p-1 pb-6 sm:p-4">
                    <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-background p-6 shadow-sm">
                        <div className="absolute -right-24 top-1/2 hidden h-56 w-56 -translate-y-1/2 rounded-full bg-primary/30 blur-3xl md:block" aria-hidden />
                        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <div className="space-y-3">
                                <span className="inline-flex w-fit items-center rounded-full border border-border/60 bg-background/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                                    {t('home.hero.badge')}
                                </span>
                                <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                                    {t('home.hero.title')}
                                </h1>
                                <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                                    {t('home.hero.description')}
                                </p>
                            </div>
                            <div className="grid w-full gap-3 sm:max-w-lg sm:grid-cols-2">
                                {stats.map(({ key, label, value, helper, Icon, showSkeleton }) => (
                                    <div key={key} className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    {label}
                                                </p>
                                                <div className="text-xl font-semibold text-foreground">
                                                    {showSkeleton ? <Skeleton className="h-6 w-12 rounded-md" /> : value}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="mt-3 text-xs text-muted-foreground">{helper}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <div className="flex flex-1 flex-col gap-6 xl:flex-row">
                        <section className="flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-background/80 shadow-sm backdrop-blur xl:w-[360px]">
                            <div className="border-b border-border/60 px-6 py-5">
                                <h2 className="text-lg font-semibold text-foreground">{t('home.favorites.title')}</h2>
                                <p className="text-sm text-muted-foreground">{t('home.favorites.description')}</p>
                            </div>
                            <FavoriteList
                                favorites={favorites}
                                loading={loading}
                                onSelect={handleSelect}
                                onToggleFavorite={toggleFavorite}
                                className="flex-1"
                                emptyLabel={t('home.favorites.empty')}
                            />
                        </section>

                        <section className="hidden flex-1 overflow-hidden rounded-3xl border border-border/60 bg-background/80 shadow-sm backdrop-blur md:flex">
                            <CharacterInfo ocid={selected} goToDetailPage={goToDetailPage} className="h-full" />
                        </section>
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="top-1/2 left-1/2 h-auto max-h-[85vh] w-[min(90vw,26rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-border/60 bg-background/95 p-0 shadow-2xl backdrop-blur">
                            <DialogTitle className="px-6 pt-6 text-base font-semibold">
                                {t('home.dialog.title')}
                            </DialogTitle>
                            <CharacterInfo
                                ocid={selected}
                                goToDetailPage={goToDetailPage}
                                className="max-h-[65vh]"
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </ScrollArea>
        </ViewTransition>
    );
};

export default Home;
