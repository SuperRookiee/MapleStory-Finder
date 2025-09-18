'use client'

import { useRouter } from "next/navigation";
import { unstable_ViewTransition as ViewTransition, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { favoriteStore } from "@/stores/favoriteStore";
import { supabase } from "@/libs/supabaseClient";
import CharacterInfo from "@/components/home/CharacterInfo";
import FavoriteList from "@/components/home/FavoriteList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
    const layoutRef = useRef<HTMLDivElement | null>(null);
    const accentRefs = useRef<(HTMLDivElement | null)[]>([]);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const overviewRef = useRef<HTMLDivElement | null>(null);
    const focusRef = useRef<HTMLDivElement | null>(null);

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
    }, [setFavoriteOcids]);

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
        if (window.innerWidth < 768) {
            setOpen(true);
        }
    };

    const goToDetailPage = () => {
        if (!selected) return;
        router.push(`/character/${selected}`);
    };

    const selectedCharacter = useMemo(
        () => favorites.find((favorite) => favorite.ocid === selected) ?? null,
        [favorites, selected],
    );

    const formattedFavorites = useMemo(
        () => new Intl.NumberFormat().format(favorites.length),
        [favorites.length],
    );

    const averageLevel = useMemo(() => {
        if (!favorites.length) return null;
        const total = favorites.reduce((sum, character) => sum + character.character_level, 0);
        return Math.round(total / favorites.length);
    }, [favorites]);

    const averageLabel = averageLevel ? t('common.level', { value: averageLevel }) : '—';
    const focusValue = selectedCharacter
        ? selectedCharacter.character_name
        : t('home.dashboard.stats.focusEmpty');
    const focusHelper = selectedCharacter
        ? `${selectedCharacter.character_class} · ${selectedCharacter.world_name}`
        : t('home.dashboard.stats.focusHelper');
    const focusBadges = useMemo(
        () =>
            selectedCharacter
                ? [
                      selectedCharacter.character_class,
                      t('common.level', { value: selectedCharacter.character_level }),
                  ]
                : [],
        [selectedCharacter, t],
    );
    const focusBadgeKey = useMemo(() => focusBadges.join('|'), [focusBadges]);
    const topFavorites = useMemo(() => favorites.slice(0, 4), [favorites]);
    const topFavoritesKey = useMemo(
        () => topFavorites.map((favorite) => favorite.ocid).join('|'),
        [topFavorites],
    );
    const focusCharacterKey = selectedCharacter?.ocid ?? 'none';

    useEffect(() => {
        const ctx = gsap.context(() => {
            const elements = accentRefs.current.filter(
                (element): element is HTMLDivElement => Boolean(element),
            );
            elements.forEach((element, index) => {
                gsap.to(element, {
                    xPercent: gsap.utils.random(-10, 10),
                    yPercent: gsap.utils.random(-8, 8),
                    scale: gsap.utils.random(0.92, 1.08),
                    rotate: gsap.utils.random(-6, 6),
                    duration: gsap.utils.random(7, 12),
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                    delay: index * 0.55,
                });
            });
        }, layoutRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (!headerRef.current) return;
        const ctx = gsap.context(() => {
            const items = Array.from(headerRef.current?.children ?? []) as HTMLElement[];
            if (!items.length) return;
            gsap.fromTo(
                items,
                { y: 26, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.08 },
            );
        }, headerRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (loading) return;
        if (!overviewRef.current) return;
        const ctx = gsap.context(() => {
            const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
            timeline.fromTo(
                overviewRef.current,
                { y: 32, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.65 },
            );
            const sections = overviewRef.current
                ?.querySelectorAll<HTMLElement>('[data-animate="overview"]') ?? [];
            if (sections.length) {
                timeline.fromTo(
                    sections,
                    { y: 24, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.55, stagger: 0.12 },
                    "-=0.35",
                );
            }
        }, overviewRef);

        return () => ctx.revert();
    }, [averageLabel, formattedFavorites, loading, topFavoritesKey]);

    useEffect(() => {
        if (loading) return;
        if (!focusRef.current) return;
        const ctx = gsap.context(() => {
            const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
            timeline.fromTo(
                focusRef.current,
                { y: 32, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.65 },
            );
            const sections = focusRef.current
                ?.querySelectorAll<HTMLElement>('[data-animate="focus"]') ?? [];
            if (sections.length) {
                timeline.fromTo(
                    sections,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
                    "-=0.35",
                );
            }
        }, focusRef);

        return () => ctx.revert();
    }, [focusBadgeKey, focusCharacterKey, focusHelper, focusValue, loading, topFavoritesKey]);

    return (
        <ViewTransition enter="fade" exit="fade">
            <div
                ref={layoutRef}
                className="relative flex h-full w-full overflow-hidden rounded-[2.75rem] border border-border"
                style={{
                    background:
                        "linear-gradient(150deg, color-mix(in srgb, var(--background) 95%, transparent) 0%, color-mix(in srgb, var(--background) 88%, transparent) 55%, color-mix(in srgb, var(--primary) 12%, transparent) 100%)",
                    boxShadow: "0 40px 120px rgba(15, 23, 42, 0.38)",
                }}
            >
                <div className="pointer-events-none absolute inset-0">
                    <div
                        ref={(element) => {
                            accentRefs.current[0] = element;
                        }}
                        className="absolute -left-32 top-10 h-72 w-72 rounded-full blur-[120px]"
                        style={{
                            background:
                                "radial-gradient(circle, color-mix(in srgb, var(--primary) 30%, transparent) 0%, transparent 70%)",
                            opacity: 0.35,
                        }}
                    />
                    <div
                        ref={(element) => {
                            accentRefs.current[1] = element;
                        }}
                        className="absolute right-[-110px] top-[-80px] h-96 w-96 rounded-full blur-[140px]"
                        style={{
                            background:
                                "radial-gradient(circle, color-mix(in srgb, var(--primary) 22%, transparent) 0%, transparent 70%)",
                            opacity: 0.28,
                        }}
                    />
                    <div
                        ref={(element) => {
                            accentRefs.current[2] = element;
                        }}
                        className="absolute bottom-[-150px] left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-[160px]"
                        style={{
                            background:
                                "radial-gradient(circle, color-mix(in srgb, var(--primary) 18%, transparent) 0%, transparent 70%)",
                            opacity: 0.3,
                        }}
                    />
                </div>

                <div className="relative z-10 flex h-full w-full flex-col gap-8 p-6 lg:p-12">
                    <header ref={headerRef} className="space-y-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
                            {t('home.dashboard.label')}
                        </span>
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                            {t('home.dashboard.title')}
                        </h1>
                        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                            {t('home.dashboard.subtitle')}
                        </p>
                    </header>

                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                        <section
                            ref={overviewRef}
                            className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/70 shadow-[0_26px_80px_rgba(15,23,42,0.22)] backdrop-blur-xl"
                            style={{
                                background:
                                    "linear-gradient(155deg, color-mix(in srgb, var(--card) 92%, transparent) 0%, color-mix(in srgb, var(--background) 95%, transparent) 55%, color-mix(in srgb, var(--primary) 16%, transparent) 100%)",
                            }}
                        >
                            <div className="pointer-events-none absolute inset-0">
                                <div
                                    ref={(element) => {
                                        accentRefs.current[3] = element;
                                    }}
                                    className="absolute -right-24 -top-16 h-64 w-64 rounded-full blur-3xl"
                                    style={{
                                        background:
                                            "radial-gradient(circle, color-mix(in srgb, var(--primary) 26%, transparent) 0%, transparent 70%)",
                                        opacity: 0.25,
                                    }}
                                />
                            </div>

                            <div className="relative z-10 flex h-full flex-col gap-6 p-6 sm:p-8">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-3" data-animate="overview">
                                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                                            {t('home.dashboard.stats.saved')}
                                        </span>
                                        <p className="text-4xl font-semibold text-foreground sm:text-5xl">
                                            {formattedFavorites}
                                        </p>
                                        <p className="max-w-xl text-sm text-muted-foreground">
                                            {t('home.dashboard.stats.savedHelper')}
                                        </p>
                                    </div>
                                    <div
                                        data-animate="overview"
                                        className="rounded-[1.75rem] border border-border/70 bg-background/50 px-6 py-5 shadow-lg backdrop-blur-xl sm:max-w-[280px]"
                                        style={{
                                            background:
                                                "linear-gradient(160deg, color-mix(in srgb, var(--background) 92%, transparent) 0%, color-mix(in srgb, var(--background) 84%, transparent) 55%, color-mix(in srgb, var(--primary) 18%, transparent) 100%)",
                                        }}
                                    >
                                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                                            {t('home.dashboard.stats.average')}
                                        </span>
                                        <p className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">{averageLabel}</p>
                                        <p className="mt-3 text-xs text-muted-foreground">
                                            {t('home.dashboard.stats.averageHelper')}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    data-animate="overview"
                                    className="rounded-[1.75rem] border border-border/70 bg-background/55 p-6 shadow-lg backdrop-blur-xl"
                                    style={{
                                        background:
                                            "linear-gradient(160deg, color-mix(in srgb, var(--background) 94%, transparent) 0%, color-mix(in srgb, var(--background) 88%, transparent) 100%)",
                                    }}
                                >
                                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                                        {t('home.dashboard.list.title')}
                                    </span>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {t('home.dashboard.list.description')}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {topFavorites.map((character) => (
                                            <span
                                                key={character.ocid}
                                                className="rounded-full border border-border/80 bg-background/60 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-foreground shadow-sm backdrop-blur"
                                            >
                                                {character.character_name}
                                            </span>
                                        ))}
                                        {favorites.length > topFavorites.length ? (
                                            <span className="rounded-full border border-border/70 bg-background/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground backdrop-blur">
                                                +{favorites.length - topFavorites.length}
                                            </span>
                                        ) : null}
                                        {!topFavorites.length ? (
                                            <span className="rounded-full border border-dashed border-border/80 bg-background/45 px-4 py-1 text-xs text-muted-foreground backdrop-blur">
                                                {t('home.dashboard.list.empty')}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section
                            ref={focusRef}
                            className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/80 shadow-[0_24px_72px_rgba(15,23,42,0.22)] backdrop-blur-xl"
                            style={{
                                background:
                                    "linear-gradient(160deg, color-mix(in srgb, var(--card) 88%, transparent) 0%, color-mix(in srgb, var(--primary) 20%, transparent) 100%)",
                            }}
                        >
                            <div className="pointer-events-none absolute inset-0">
                                <div
                                    ref={(element) => {
                                        accentRefs.current[4] = element;
                                    }}
                                    className="absolute left-1/2 top-[-70px] h-72 w-72 -translate-x-1/2 rounded-full blur-[140px]"
                                    style={{
                                        background:
                                            "radial-gradient(circle, color-mix(in srgb, var(--primary) 28%, transparent) 0%, transparent 70%)",
                                        opacity: 0.35,
                                    }}
                                />
                            </div>

                            <div className="relative z-10 flex h-full flex-col gap-6 p-6 sm:p-8">
                                <div className="space-y-3" data-animate="focus">
                                    <span className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                                        {t('home.dashboard.stats.focus')}
                                    </span>
                                    <p className="text-3xl font-semibold text-foreground sm:text-4xl">{focusValue}</p>
                                    <p className="text-sm text-muted-foreground">{focusHelper}</p>
                                </div>

                                {focusBadges.length ? (
                                    <div className="flex flex-wrap gap-2" data-animate="focus">
                                        {focusBadges.map((badge) => (
                                            <span
                                                key={badge}
                                                className="rounded-full border border-border/80 bg-background/60 px-4 py-1 text-xs font-medium tracking-wide text-foreground shadow-sm backdrop-blur"
                                            >
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                ) : null}

                                <div className="mt-auto space-y-4" data-animate="focus">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                                            {t('home.dashboard.list.title')}
                                        </span>
                                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                                            {t('home.dashboard.list.totalLabel')}
                                            <span className="ml-2 text-base font-semibold tracking-normal text-foreground">
                                                {formattedFavorites}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {topFavorites.map((character) => (
                                            <div
                                                key={character.ocid}
                                                className={`flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/55 px-4 py-3 text-sm text-foreground shadow-sm backdrop-blur transition-colors ${
                                                    selected === character.ocid ? 'border-primary/60 bg-primary/15' : ''
                                                }`}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-medium tracking-tight">
                                                        {character.character_name}
                                                    </span>
                                                    <span
                                                        className={`text-xs ${
                                                            selected === character.ocid
                                                                ? 'text-primary-foreground/80'
                                                                : 'text-muted-foreground'
                                                        }`}
                                                    >
                                                        {character.character_class} · {character.world_name}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                                                    {t('common.level', { value: character.character_level })}
                                                </span>
                                            </div>
                                        ))}
                                        {!topFavorites.length ? (
                                            <div className="rounded-2xl border border-dashed border-border/70 bg-background/55 px-4 py-6 text-center text-sm text-muted-foreground backdrop-blur">
                                                {t('home.dashboard.stats.focusHelper')}
                                            </div>
                                        ) : null}
                                        {favorites.length > topFavorites.length ? (
                                            <div className="rounded-2xl border border-border/70 bg-background/45 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground backdrop-blur">
                                                +{favorites.length - topFavorites.length}
                                            </div>
                                        ) : null}
                                    </div>
                                    {selectedCharacter ? (
                                        <div className="pt-2">
                                            <Button
                                                variant="outline"
                                                className="w-full border-border bg-background/60 text-foreground shadow-md backdrop-blur"
                                                onClick={goToDetailPage}
                                            >
                                                {t('home.characterInfo.detailButton')}
                                            </Button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
                        <FavoriteList
                            favorites={favorites}
                            loading={loading}
                            onSelect={handleSelect}
                            onToggleFavorite={toggleFavorite}
                            selected={selected}
                            className="w-full lg:w-[360px] xl:w-[420px]"
                        />
                        <CharacterInfo ocid={selected} goToDetailPage={goToDetailPage} />
                    </div>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    className="fixed left-1/2 top-1/2 max-h-[90vh] w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[2rem] border border-border/70 bg-background/95 p-0 shadow-2xl backdrop-blur"
                >
                    <DialogTitle className="px-5 pt-5 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                        {t('home.dialog.title')}
                    </DialogTitle>
                    <CharacterInfo
                        ocid={selected}
                        goToDetailPage={goToDetailPage}
                        className="flex max-h-[80vh] md:hidden"
                    />
                </DialogContent>
            </Dialog>
        </ViewTransition>
    );
};

export default Home;
