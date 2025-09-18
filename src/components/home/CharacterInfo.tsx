'use client'

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useCharacterPreviewStore } from "@/stores/characterPreviewStore";
import ItemEquipments from "@/components/character/item/ItemEquipments";
import WorldIcon from "@/components/common/WorldIcon";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { findCharacterBasic, findCharacterItemEquipment } from "@/fetchs/character.fetch";
import { ICharacterBasic, IItemEquipment } from "@/interface/character/ICharacter";
import { useTranslations } from "@/providers/LanguageProvider";
import { cn } from "@/utils/utils";

interface ICharacterInfoProps {
    ocid: string | null;
    goToDetailPage: () => void;
    className?: string;
}

const CharacterInfo = ({ ocid, goToDetailPage, className }: ICharacterInfoProps) => {
    const [basic, setBasic] = useState<ICharacterBasic | null>(null);
    const [items, setItems] = useState<IItemEquipment[]>([]);
    const t = useTranslations();
    const [loading, setLoading] = useState(false);
    const setPreview = useCharacterPreviewStore((state) => state.setPreview);
    const clearPreview = useCharacterPreviewStore((state) => state.clear);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const infoRef = useRef<HTMLDivElement | null>(null);
    const gearRef = useRef<HTMLDivElement | null>(null);

    const imageTransitionName = useMemo(() => {
        if (!ocid) return undefined;
        const sanitized = ocid.replace(/[^a-zA-Z0-9_-]/g, "-");
        return `character-image-${sanitized}`;
    }, [ocid]);

    useEffect(() => {
        if (!ocid) {
            setBasic(null);
            setItems([]);
            setLoading(false);
            clearPreview();
            return;
        }
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            try {
                const [basicRes, itemRes] = await Promise.all([
                    findCharacterBasic(ocid),
                    findCharacterItemEquipment(ocid),
                ]);
                if (cancelled) return;
                setBasic(basicRes.data);
                setItems(itemRes.data.item_equipment);
                setPreview(ocid, basicRes.data);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [ocid, clearPreview, setPreview]);

    const characterImageSrc = useMemo(() => {
        if (!basic?.character_image) return null;
        return `/api/crop?url=${encodeURIComponent(basic.character_image)}`;
    }, [basic?.character_image]);

    useEffect(() => {
        if (!basic || loading) return;
        const context = gsap.context(() => {
            const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
            if (cardRef.current) {
                timeline.fromTo(
                    cardRef.current,
                    { opacity: 0, y: 28 },
                    { opacity: 1, y: 0, duration: 0.65 },
                );
            }
            if (infoRef.current) {
                const elements = infoRef.current.querySelectorAll<HTMLElement>('[data-animate="meta"]');
                if (elements.length) {
                    timeline.fromTo(
                        elements,
                        { y: 18, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.45, stagger: 0.08 },
                        "-=0.35",
                    );
                }
            }
            if (gearRef.current) {
                timeline.fromTo(
                    gearRef.current,
                    { opacity: 0, y: 32 },
                    { opacity: 1, y: 0, duration: 0.6 },
                    "-=0.35",
                );
            }
        }, containerRef);
        return () => context.revert();
    }, [basic, loading, ocid]);

    return (
        <ScrollArea className={cn("hidden min-h-0 flex-1 md:flex", className)}>
            {!ocid ? (
                <div className="flex h-full items-center justify-center px-6 text-center text-muted-foreground">
                    <div className="rounded-3xl border border-dashed border-border px-10 py-12">
                        {t('home.characterInfo.emptyState')}
                    </div>
                </div>
            ) : (
                <div ref={containerRef} className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-10">
                    <div
                        ref={cardRef}
                        className="relative flex flex-col overflow-hidden rounded-3xl border border-border shadow-2xl lg:flex-row"
                        style={{
                            background:
                                "linear-gradient(150deg, color-mix(in srgb, var(--card) 94%, transparent) 0%, color-mix(in srgb, var(--background) 88%, transparent) 55%, color-mix(in srgb, var(--primary) 14%, transparent) 100%)",
                        }}
                    >
                        <div className="pointer-events-none absolute inset-0">
                            <div
                                className="absolute -left-24 top-12 h-64 w-64 rounded-full blur-3xl"
                                style={{
                                    background:
                                        "radial-gradient(circle, color-mix(in srgb, var(--primary) 36%, transparent) 0%, transparent 70%)",
                                    opacity: 0.45,
                                }}
                            />
                            <div
                                className="absolute bottom-[-72px] right-[-48px] h-80 w-80 rounded-full blur-3xl"
                                style={{
                                    background:
                                        "radial-gradient(circle, color-mix(in srgb, var(--primary) 24%, transparent) 0%, transparent 70%)",
                                    opacity: 0.35,
                                }}
                            />
                        </div>

                        <section
                            ref={infoRef}
                            className="relative z-10 flex flex-col items-center gap-6 px-6 pb-10 pt-8 text-center lg:flex-[0.45] lg:items-start lg:px-10 lg:pb-12 lg:pt-12 lg:text-left"
                        >
                            <div
                                data-animate="meta"
                                className="inline-flex items-center gap-3 rounded-full border border-border px-4 py-2 text-sm font-medium"
                                style={{
                                    background:
                                        "linear-gradient(120deg, color-mix(in srgb, var(--background) 94%, transparent) 0%, color-mix(in srgb, var(--background) 88%, transparent) 100%)",
                                }}
                            >
                                {loading || !basic ? (
                                    <>
                                        <Skeleton className="h-6 w-6 rounded-full" />
                                        <Skeleton className="h-5 w-24" />
                                    </>
                                ) : (
                                    <>
                                        <WorldIcon name={basic.world_name} />
                                        <span>{basic.world_name}</span>
                                    </>
                                )}
                            </div>

                            <div
                                data-animate="meta"
                                className="relative flex aspect-square w-64 max-w-full items-center justify-center overflow-hidden rounded-3xl border border-border"
                                style={{
                                    background:
                                        "linear-gradient(180deg, color-mix(in srgb, var(--background) 96%, transparent) 0%, color-mix(in srgb, var(--background) 85%, transparent) 100%)",
                                }}
                            >
                                {loading || !basic ? (
                                    <Skeleton className="h-56 w-56" />
                                ) : (
                                    characterImageSrc && (
                                        <div
                                            className="flex h-full w-full items-center justify-center"
                                            style={
                                                imageTransitionName
                                                    ? { viewTransitionName: imageTransitionName }
                                                    : undefined
                                            }
                                        >
                                            <Image
                                                src={characterImageSrc}
                                                alt={basic.character_name}
                                                className="h-auto w-full max-w-[220px] object-contain"
                                                width={220}
                                                height={220}
                                                priority
                                            />
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="flex w-full flex-col items-center gap-3 lg:items-start">
                                <div className="flex w-full flex-col gap-2" data-animate="meta">
                                    {loading || !basic ? (
                                        <Skeleton className="h-8 w-48" />
                                    ) : (
                                        <h2 className="text-3xl font-semibold tracking-tight">
                                            {basic.character_name}
                                        </h2>
                                    )}
                                    {loading || !basic ? (
                                        <Skeleton className="h-5 w-32" />
                                    ) : (
                                        <p className="text-sm text-muted-foreground">{basic.character_class}</p>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start" data-animate="meta">
                                    {loading || !basic ? (
                                        <Skeleton className="h-6 w-24" />
                                    ) : (
                                        <span
                                            className="rounded-full px-4 py-1 text-xs font-semibold tracking-wide"
                                            style={{
                                                background:
                                                    "linear-gradient(120deg, color-mix(in srgb, var(--primary) 26%, transparent) 0%, color-mix(in srgb, var(--primary) 12%, transparent) 100%)",
                                                color: "var(--primary-foreground)",
                                            }}
                                        >
                                            {t('common.level', { value: basic.character_level })}
                                        </span>
                                    )}
                                </div>

                                <div className="pt-2" data-animate="meta">
                                    {loading || !basic ? (
                                        <Skeleton className="h-11 w-28" />
                                    ) : (
                                        <Button size="lg" onClick={goToDetailPage} className="shadow-md">
                                            {t('home.characterInfo.detailButton')}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </section>

                        <div
                            ref={gearRef}
                            className="relative z-10 flex flex-1 items-center justify-center px-6 pb-10 pt-0 lg:px-10 lg:pb-12"
                        >
                            <div className="w-full max-w-[420px]">
                                <ItemEquipments items={items} loading={loading || !basic} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ScrollArea>
    );
};

export default CharacterInfo;
