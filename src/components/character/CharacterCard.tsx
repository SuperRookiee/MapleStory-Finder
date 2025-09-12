'use client'

import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ICharacterSummary } from "@/interface/character/ICharacterSummary";

interface ICharacterCardProps {
    character: ICharacterSummary;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
    onSelect?: () => void;
}

const CharacterCard = ({
    character,
    isFavorite,
    onToggleFavorite,
    onSelect,
}: ICharacterCardProps) => {
    return (
        <Card
            className={`p-4 flex flex-col relative w-full ${onSelect ? "cursor-pointer" : ""}`}
            onClick={onSelect}
        >
            {/* 즐겨찾기 버튼 */}
            <div className="absolute top-2 right-2 z-10">
                <Button
                    variant='ghost'
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); // 부모 onClick 방지
                        onToggleFavorite?.();
                    }}
                >
                    <Star className={`h-5 w-5 ${isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}/>
                </Button>
            </div>

            {/* 캐릭터 이미지 */}
            <div className="relative w-full aspect-[4/3] mb-4">
                {character.image && (
                    <Image
                        src={character.image}
                        alt={character.character_name}
                        className="object-contain"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        fill
                    />
                )}
            </div>

            {/* 캐릭터 정보 */}
            <div className="mt-auto flex items-end justify-between min-h-[64px] sm:min-h-[72px] md:min-h-[80px]">
                <div className="truncate max-w-[70%]">
                    <p className="font-bold text-sm sm:text-base md:text-lg lg:text-xl">
                        {character.character_name}
                    </p>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground truncate">
                        {character.character_class}
                    </p>
                </div>
                <p className="text-red-500 font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl shrink-0 ml-2">
                    {character.character_level}
                </p>
            </div>
        </Card>
    );
};

export default CharacterCard;