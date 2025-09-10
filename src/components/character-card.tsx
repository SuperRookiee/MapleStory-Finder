'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { findCharacterBasic } from "@/fetch/character.fetch";

interface CharacterSummary {
    ocid: string;
    character_name: string;
    world_name: string;
    character_class: string;
    character_level: number;
}

export default function CharacterCard({ character }: { character: CharacterSummary }) {
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        findCharacterBasic(character.ocid).then(data => {
            setImage(data.character_image);
        }).catch(() => {});
    }, [character.ocid]);

    return (
        <Card className="p-4 flex flex-col">
            <div className="relative w-full h-60 mb-4">
                {image && (
                    <Image
                        src={image}
                        alt={character.character_name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                )}
            </div>
            <div className="mt-auto flex items-end justify-between">
                <div>
                    <p className="font-bold">{character.character_name}</p>
                    <p className="text-sm text-muted-foreground">{character.character_class}</p>
                </div>
                <p className="text-red-500 text-2xl font-bold">{character.character_level}</p>
            </div>
        </Card>
    );
}
