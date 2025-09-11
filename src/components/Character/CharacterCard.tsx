'use client'

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { findCharacterBasic } from "@/fetch/character.fetch";

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

const CharacterCard = ({
    character,
    isFavorite,
    onToggleFavorite,
    onSelect,
}: Props) => {
    const [image, setImage] = useState<string | null>(character.image ?? null);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current || image) return;

        const observer = new IntersectionObserver(
            async ([entry], obs) => {
                if (entry.isIntersecting) {
                    try {
                        const data = await findCharacterBasic(character.ocid);
                        setImage(data.character_image);
                    } catch {
                        // ignore
                    } finally {
                        obs.disconnect();
                    }
                }
            },
            { threshold: 0.25, rootMargin: "200px" }
        );

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [character.ocid, image]);

    const content = (
        <Card className="p-4 flex flex-col relative w-full" onClick={onSelect} ref={ref}>
            <div
                className="absolute top-2 right-2"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleFavorite?.();
                }}
            >
                <Star
                    className={`h-5 w-5 ${
                        isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                />
            </div>
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

    if (onSelect) {
        return <div className="cursor-pointer">{content}</div>;
    }

    return (
        <Link href={`/character/${character.ocid}`} className="block">
            {content}
        </Link>
    );
};

export default CharacterCard;
