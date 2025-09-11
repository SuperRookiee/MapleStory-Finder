'use client'

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { findCharacterBasic } from "@/fetchs/character.fetch";
import { Button } from "@/components/ui/button";

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

    return (
        <Card
            className={`p-4 flex flex-col relative w-full ${onSelect ? "cursor-pointer" : ""}`}
            onClick={onSelect}
            ref={ref}
        >
            {/* 즐겨찾기 버튼 */}
            <div className="absolute top-2 right-2 z-10">
                <Button
                    variant='ghost'
                    onClick={(e) => {
                        console.log("????")
                        e.preventDefault();
                        e.stopPropagation(); // 부모 onClick 방지
                        onToggleFavorite?.();
                    }}
                >
                    <Star className={`h-5 w-5 ${isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}/>
                </Button>
            </div>

            {/* 캐릭터 이미지 */}
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

            {/* 캐릭터 정보 */}
            <div className="mt-auto flex items-end justify-between">
                <div>
                    <p className="font-bold">{character.character_name}</p>
                    <p className="text-sm text-muted-foreground">{character.character_class}</p>
                </div>
                <p className="text-red-500 text-2xl font-bold">{character.character_level}</p>
            </div>
        </Card>
    );
};

export default CharacterCard;