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
import { cn } from "@/utils/utils";

interface ICharacterInfoProps {
    ocid: string | null;
    goToDetailPage: () => void;
    className?: string;
}

const CharacterInfo = ({ ocid, goToDetailPage, className }: ICharacterInfoProps) => {
    const [basic, setBasic] = useState<ICharacterBasic | null>(null);
    const [items, setItems] = useState<IItemEquipment[]>([]);
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
        <ScrollArea className={cn("hidden md:flex flex-1", className)}>
            {!ocid ? (
                <div className="flex justify-center items-center w-full h-page animate-pulse">
                    Please choose your character
                </div>
            ) : (
                <div className="p-4 max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-10">
                        <section className="lg:flex-[0.4] flex flex-col items-center max-w-[300px] mx-auto">
                            <div className="self-start flex items-center gap-2 text-xl">
                                {loading || !basic ? (
                                    <>
                                        <Skeleton className="w-6 h-6 rounded-full" />
                                        <Skeleton className="h-6 w-24" />
                                    </>
                                ) : (
                                    <>
                                        <WorldIcon name={basic.world_name} />
                                        {basic.world_name}
                                    </>
                                )}
                            </div>

                            {loading || !basic ? (
                                <Skeleton className="w-64 h-64 mt-4" />
                            ) : (
                                characterImageSrc && (
                                    <div
                                        className="w-64 h-64 mt-4 flex items-center justify-center"
                                        style={imageTransitionName ? { viewTransitionName: imageTransitionName } : undefined}
                                    >
                                        <Image
                                            src={characterImageSrc}
                                            alt={basic.character_name}
                                            className="object-contain h-auto"
                                            width={100}
                                            height={100}
                                            priority
                                        />
                                    </div>
                                )
                            )}

                            {loading || !basic ? (
                                <Skeleton className="h-8 w-40 mt-4" />
                            ) : (
                                <h2 className="text-2xl font-bold mt-4 text-center lg:text-left">
                                    {basic.character_name}
                                </h2>
                            )}

                            {loading || !basic ? (
                                <Skeleton className="h-6 w-32" />
                            ) : (
                                <p className="text-center lg:text-left text-muted-foreground">
                                    {basic.character_class}
                                </p>
                            )}

                            {loading || !basic ? (
                                <Skeleton className="h-6 w-24" />
                            ) : (
                                <p className="text-center lg:text-left font-bold text-red-500">
                                    Lv. {basic.character_level}
                                </p>
                            )}

                            <div className="flex justify-center">
                                {loading || !basic ? (
                                    <Skeleton className="h-10 w-20" />
                                ) : (
                                    <Button onClick={goToDetailPage}>Detail</Button>
                                )}
                            </div>
                        </section>

                        {/* 우측: 장비 */}
                        <div className="lg:flex-[0.6] flex justify-center">
                            <div className="mx-auto max-w-[360px] md:max-w-[420px]">
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
