'use client'

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface CharacterSummary {
    ocid: string;
    character_name: string;
    world_name: string;
    character_class: string;
    character_level: number;
    image?: string;
}

export default function CharacterCard({ character }: { character: CharacterSummary }) {
    return (
        <Link href={`/character/${character.ocid}`} className="block">
            <Card className="p-4 flex flex-col">
                <div className="relative w-full h-60 mb-4">
                    {character.image && (
                        <Image
                            src={character.image}
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
        </Link>
    );
}
