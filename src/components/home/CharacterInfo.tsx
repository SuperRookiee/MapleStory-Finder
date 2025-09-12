'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import ItemEquipments from "@/components/character/item/ItemEquipments";
import { findCharacterBasic, findCharacterItemEquipment } from "@/fetchs/character.fetch";
import { IItemEquipment } from "@/interface/ICharacter";

interface IBasicInfo {
    character_name: string;
    character_level: number;
    character_class: string;
    character_image?: string;
}

interface ICharacterInfoProps {
    ocid: string | null;
}

const CharacterInfo = ({ ocid }: ICharacterInfoProps) => {
    const [basic, setBasic] = useState<IBasicInfo | null>(null);
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
                setBasic(basicRes as IBasicInfo);
                setItems(itemRes.item_equipment);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [ocid]);

    return (
        <ScrollArea className="hidden md:flex flex-1">
            {!ocid ? (
                <div className="flex justify-center items-center w-full h-page animate-pulse">
                    Please choose your character
                </div>
            ) : loading || !basic ? (
                <div className="flex justify-center items-center w-full h-page">
                    <Spinner />
                </div>
            ) : (
                <div className="p-4 space-y-4 max-w-2xl mx-auto">
                    {basic.character_image && (
                        <div className="relative w-64 h-64 mx-auto">
                            <Image
                                src={basic.character_image}
                                alt={basic.character_name}
                                fill
                                className="object-contain"
                                sizes="256px"
                            />
                        </div>
                    )}
                    <h2 className="text-2xl font-bold text-center">{basic.character_name}</h2>
                    <p className="text-center text-muted-foreground">{basic.character_class}</p>
                    <p className="text-center font-bold text-red-500">Lv. {basic.character_level}</p>
                    {items.length > 0 && <ItemEquipments items={items} />}
                </div>
            )}
        </ScrollArea>
    );
};

export default CharacterInfo;
