'use client'

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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

    return (
        <ScrollArea className={cn("h-full", className)}>
            <div className="mx-auto flex h-full w-full max-w-5xl flex-col gap-6 p-6">
                {!ocid ? (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="rounded-3xl border border-dashed border-border/60 bg-muted/20 px-8 py-12 text-center text-sm text-muted-foreground">
                            {t('home.characterInfo.emptyState')}
                        </div>
                    </div>
                ) : (
                    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-background p-6 shadow-sm">
                        <div className="absolute -right-24 top-1/2 hidden h-64 w-64 -translate-y-1/2 rounded-full bg-primary/30 blur-3xl xl:block" aria-hidden />
                        <div className="relative flex flex-col gap-6 xl:flex-row">
                            <section className="flex flex-col items-center gap-5 text-center xl:w-72 xl:items-start xl:text-left">
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    {loading || !basic ? (
                                        <>
                                            <Skeleton className="h-6 w-6 rounded-full" />
                                            <Skeleton className="h-4 w-24" />
                                        </>
                                    ) : (
                                        <>
                                            <WorldIcon name={basic.world_name} />
                                            <span>{basic.world_name}</span>
                                        </>
                                    )}
                                </div>

                                <div className="relative aspect-square w-52 max-w-full overflow-hidden rounded-2xl border border-border/40 bg-background/70 p-6 shadow-inner">
                                    {loading || !basic ? (
                                        <Skeleton className="h-full w-full" />
                                    ) : (
                                        characterImageSrc && (
                                            <div
                                                className="flex h-full w-full items-center justify-center"
                                                style={imageTransitionName ? { viewTransitionName: imageTransitionName } : undefined}
                                            >
                                                <Image
                                                    src={characterImageSrc}
                                                    alt={basic.character_name}
                                                    className="h-full w-auto max-h-full object-contain"
                                                    width={200}
                                                    height={200}
                                                    priority
                                                />
                                            </div>
                                        )
                                    )}
                                </div>

                                <div className="space-y-1">
                                    {loading || !basic ? (
                                        <Skeleton className="h-8 w-40" />
                                    ) : (
                                        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                                            {basic.character_name}
                                        </h2>
                                    )}
                                    {loading || !basic ? (
                                        <Skeleton className="h-5 w-32" />
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            {basic.character_class}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-center gap-2 xl:justify-start">
                                    {loading || !basic ? (
                                        <Skeleton className="h-8 w-24" />
                                    ) : (
                                        <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                                            {t('home.stats.level', { level: basic.character_level })}
                                        </span>
                                    )}
                                </div>

                                <div className="flex w-full justify-center xl:justify-start">
                                    {loading || !basic ? (
                                        <Skeleton className="h-10 w-28" />
                                    ) : (
                                        <Button onClick={goToDetailPage} className="rounded-full px-6">
                                            {t('home.characterInfo.detailButton')}
                                        </Button>
                                    )}
                                </div>
                            </section>

                            <div className="flex flex-1 items-stretch">
                                <div className="w-full max-w-xl xl:ml-auto">
                                    <ItemEquipments items={items} loading={loading || !basic} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
    );
};

export default CharacterInfo;
