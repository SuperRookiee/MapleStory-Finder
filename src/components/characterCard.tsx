'use client'

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CharacterSummary {
    ocid: string;
    character_name: string;
    world_name: string;
    character_class: string;
    character_level: number;
    image?: string;
}

interface Props {
    character: CharacterSummary;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
    onSelect?: () => void;
}

export default function CharacterCard({
    character,
    isFavorite,
    onToggleFavorite,
    onSelect,
}: Props) {
    const content = (
        <Card className="p-4 flex flex-col relative" onClick={onSelect}>
            <div className="absolute top-2 right-2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite?.(); }}>
                <Star
                    className={`h-5 w-5 ${isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
            </div>
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
    );

    if (onSelect) {
        return <div className="cursor-pointer">{content}</div>;
    }

    return (
        <Link href={`/character/${character.ocid}`} className="block">
            {content}
        </Link>
    );
}
