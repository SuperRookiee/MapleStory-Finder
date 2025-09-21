'use client'

import { unstable_ViewTransition as ViewTransition, useCallback, useEffect, useMemo, useState } from "react";
import { Filter, Search, Star, Users } from "lucide-react";
import { toast } from "sonner";
import { characterListStore } from "@/stores/characterListStore";
import { favoriteStore } from "@/stores/favoriteStore";
import { userStore } from "@/stores/userStore";
import { supabase } from "@/libs/supabaseClient";
import CharacterCardSkeleton from "@/components/character/CharacterCardSkeleton";
import CharacterCell from "@/components/character/CharacterCell";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { addFavorite, getFavorites, removeFavorite } from "@/fetchs/favorite.fetch";
import { ICharacterSummary } from "@/interface/character/ICharacterSummary";
import { useTranslations } from "@/providers/LanguageProvider";

const ALL_WORLDS_VALUE = "all";

const CharacterList = () => {
    const t = useTranslations();
    const setApiKey = userStore((s) => s.setApiKey);
    const { characters, loading, fetchCharacters, loadCharacterImage } = characterListStore();
    const [displayCharacters, setDisplayCharacters] = useState<ICharacterSummary[]>([]);
    const [worldFilter, setWorldFilter] = useState(ALL_WORLDS_VALUE);
    const [searchKeyword, setSearchKeyword] = useState("");
    const { favorites, setFavorites, addFavorite: addFavoriteOcid, removeFavorite: removeFavoriteOcid } = favoriteStore();
    const [userId, setUserId] = useState<string | null>(null);
    const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);

    const handleScrollContainerRef = useCallback((node: HTMLDivElement | null) => {
        setScrollContainer(node);
    }, []);

    useEffect(() => {
        const load = async () => {
            const { data } = await supabase.auth.getSession();
            const session = data.session;

            if (!session) {
                return;
            }

            setUserId(session.user.id);
            const key = session.user.user_metadata?.nexon_api_key;
            if (key) setApiKey(key);

            try {
                await fetchCharacters();
                const currentFavorites = favoriteStore.getState().favorites;
                if (currentFavorites.length === 0) {
                    const favorite = await getFavorites(session.user.id);
                    setFavorites(favorite);
                }
            } catch (err) {
                if (err instanceof Error) toast.error(err.message);
            }
        };

        load();
    }, []);

    // 서버 선택 필터링
    useEffect(() => {
        const keyword = searchKeyword.trim().toLowerCase();
        const filtered = characters.filter((c) => {
            const matchesWorld = worldFilter === ALL_WORLDS_VALUE || c.world_name === worldFilter;
            const matchesKeyword = c.character_name.toLowerCase().includes(keyword);

            return matchesWorld && matchesKeyword;
        });
        setDisplayCharacters(filtered);
    }, [characters, worldFilter, searchKeyword]);

    const toggleFavorite = useCallback(async (ocid: string) => {
        if (!userId) return;
        if (favorites.includes(ocid)) {
            await removeFavorite(userId, ocid);
            removeFavoriteOcid(ocid);
        } else {
            await addFavorite(userId, ocid);
            addFavoriteOcid(ocid);
        }
    }, [userId, favorites]);

    const worlds = useMemo(
        () => [ALL_WORLDS_VALUE, ...Array.from(new Set(characters.map((c) => c.world_name)))],
        [characters],
    );
    const filteredCount = displayCharacters.length;
    const selectedWorldLabel = worldFilter === ALL_WORLDS_VALUE ? t('characterList.filters.world.all') : worldFilter;
    const stats = useMemo(
        () => [
            {
                key: 'total' as const,
                label: t('characterList.stats.total'),
                value: characters.length.toLocaleString(),
                helper: t('characterList.stats.totalHelper'),
                Icon: Users,
            },
            {
                key: 'filtered' as const,
                label: t('characterList.stats.filtered'),
                value: filteredCount.toLocaleString(),
                helper: t('characterList.stats.filteredHelper', { world: selectedWorldLabel }),
                Icon: Filter,
            },
            {
                key: 'favorites' as const,
                label: t('characterList.stats.favorites'),
                value: favorites.length.toLocaleString(),
                helper: t('characterList.stats.favoritesHelper', { count: favorites.length }),
                Icon: Star,
            },
        ],
        [characters.length, favorites.length, filteredCount, selectedWorldLabel, t],
    );

    return (
        <ViewTransition enter="fade" exit="fade">
            <ScrollArea className="h-page">
                <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col gap-6 p-1 pb-6 sm:p-4">
                    <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-background p-6 shadow-sm">
                        <div className="absolute -left-24 top-1/2 hidden h-56 w-56 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl md:block" aria-hidden />
                        <div className="absolute -right-20 -top-10 hidden h-48 w-48 rounded-full bg-primary/10 blur-3xl lg:block" aria-hidden />
                        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <div className="space-y-3">
                                <span className="inline-flex w-fit items-center rounded-full border border-border/60 bg-background/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                                    {t('characterList.header.badge')}
                                </span>
                                <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                                    {t('characterList.header.title')}
                                </h1>
                                <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
                                    {t('characterList.header.description')}
                                </p>
                            </div>
                            <div className="grid w-full gap-3 sm:max-w-2xl sm:grid-cols-3">
                                {stats.map(({ key, label, value, helper, Icon }) => (
                                    <div key={key} className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    {label}
                                                </p>
                                                <p className="text-xl font-semibold text-foreground">{value}</p>
                                            </div>
                                        </div>
                                        <p className="mt-3 text-xs text-muted-foreground">{helper}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-border/60 bg-background/80 shadow-sm backdrop-blur">
                        <div className="border-b border-border/60 px-6 py-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold text-foreground">{t('characterList.list.title')}</h2>
                                    <p className="text-sm text-muted-foreground">{t('characterList.list.description')}</p>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)] sm:items-end lg:w-[500px]">
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            {t('characterList.filters.world.label')}
                                        </p>
                                        {loading ? (
                                            <Skeleton className="h-12 w-full rounded-xl" />
                                        ) : (
                                            <Select value={worldFilter} onValueChange={setWorldFilter}>
                                                <SelectTrigger
                                                    className="h-12 w-full rounded-xl border-border/60 bg-background/80 px-5 text-sm shadow-sm"
                                                    aria-label={t('characterList.filters.world.label')}
                                                >
                                                    <SelectValue placeholder={t('characterList.filters.world.label')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {worlds.map((world) => (
                                                        <SelectItem key={world} value={world}>
                                                            {world === ALL_WORLDS_VALUE
                                                                ? t('characterList.filters.world.all')
                                                                : world}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            {t('characterList.filters.search.label')}
                                        </p>
                                        {loading ? (
                                            <Skeleton className="h-12 w-full rounded-xl" />
                                        ) : (
                                            <div className="relative">
                                                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    value={searchKeyword}
                                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                                    placeholder={t('characterList.filters.search.placeholder')}
                                                    className="h-12 w-full rounded-xl border-border/60 bg-background/80 pl-11 pr-4 text-sm shadow-sm"
                                                    aria-label={t('characterList.filters.search.label')}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            {loading ? (
                                <div className="grid h-full grid-cols-1 gap-4 overflow-y-auto p-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <CharacterCardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : filteredCount === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-12 text-center">
                                    <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-10 shadow-sm">
                                        <h3 className="text-base font-semibold text-foreground">
                                            {t('characterList.empty.title')}
                                        </h3>
                                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                            {t('characterList.empty.description')}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div ref={handleScrollContainerRef} className="h-full overflow-y-auto px-2 pb-6">
                                    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {displayCharacters.map((character) => (
                                            <CharacterCell
                                                key={character.ocid}
                                                character={character}
                                                favorites={favorites}
                                                toggleFavorite={toggleFavorite}
                                                loadCharacterImage={loadCharacterImage}
                                                scrollContainer={scrollContainer}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </ScrollArea>
        </ViewTransition>
    );
};

export default CharacterList;
