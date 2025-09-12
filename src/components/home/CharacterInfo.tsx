'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/libs/utils";
import ItemEquipments from "@/components/character/item/ItemEquipments";
import WorldIcon from "@/components/common/WorldIcon";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { findCharacterBasic, findCharacterItemEquipment } from "@/fetchs/character.fetch";
import { ICharacterBasic, IItemEquipment } from "@/interface/character/ICharacter";

interface ICharacterInfoProps {
    ocid: string | null;
    goToDetailPage: () => void;
    className?: string;
}

const CharacterInfo = ({ ocid, goToDetailPage, className }: ICharacterInfoProps) => {
    const [basic, setBasic] = useState<ICharacterBasic | null>(null);
    const [items, setItems] = useState<IItemEquipment[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!ocid) return;
        const load = async () => {
            setLoading(true);
            try {
                const [basicRes, itemRes] = await Promise.all([
                    findCharacterBasic(ocid),
                    findCharacterItemEquipment(ocid),
                ]);
                setBasic(basicRes.data);
                setItems(itemRes.data.item_equipment);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [ocid]);

    return (
        <ScrollArea className={cn("hidden md:flex flex-1", className)}>
            {!ocid ? (
                <div className="flex justify-center items-center w-full h-page animate-pulse">
                    Please choose your character
                </div>
            ) : loading || !basic ? (
                <div className="flex justify-center items-center w-full h-page">
                    <Spinner/>
                </div>
            ) : (
                <div className="p-4 max-w-6xl mx-auto">
                    {/* 좌우 배치 */}
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* 좌측: 캐릭터 정보 */}
                        <section className="flex-1 flex flex-col items-center">
                            <div className="self-start flex items-center gap-2 text-xl">
                                <WorldIcon name={basic.world_name} />
                                {basic.world_name}
                            </div>

                            {basic.character_image && (
                                <div className="relative w-64 h-64 mt-4">
                                    <Image
                                        src={basic.character_image}
                                        alt={basic.character_name}
                                        fill
                                        className="object-contain"
                                        sizes="256px"
                                    />
                                </div>
                            )}

                            <h2 className="text-2xl font-bold mt-4 text-center lg:text-left">
                                {basic.character_name}
                            </h2>
                            <p className="text-center lg:text-left text-muted-foreground">
                                {basic.character_class}
                            </p>
                            <p className="text-center lg:text-left font-bold text-red-500">
                                Lv. {basic.character_level}
                            </p>
                            <div className="flex justify-center">
                                <Button onClick={goToDetailPage}>Detail</Button>
                            </div>
                        </section>

                        {/* 우측: 장비 */}
                        {items.length > 0 && (
                            <div className="flex-1 flex justify-center">
                                <div className="w-[420px] mx-auto">
                                    <ItemEquipments items={items} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </ScrollArea>
    );
};

export default CharacterInfo;
