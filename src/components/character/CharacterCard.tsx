'use client'

import Image from "next/image";
import { Star } from "lucide-react";
import WorldIcon from "@/components/common/WorldIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ICharacterSummary } from "@/interface/character/ICharacterSummary";
import { cn } from "@/utils/utils";

interface ICharacterCardProps {
    character: ICharacterSummary;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
    onSelect?: () => void;
    className?: string;
}

const CharacterCard = ({
    character,
    isFavorite,
    onToggleFavorite,
    onSelect,
    className,
}: ICharacterCardProps) => {
    return (
        <Card
            className={cn(
                "favorite-card group relative w-full overflow-hidden rounded-2xl p-4 transition-all duration-300",
                onSelect ? "cursor-pointer" : "",
                className,
            )}
            onClick={onSelect}
        >
            <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background:
                        "linear-gradient(135deg, color-mix(in srgb, var(--primary) 18%, transparent) 0%, color-mix(in srgb, var(--primary) 6%, transparent) 45%, transparent 90%)",
                }}
            />
            {/* 서버 정보 */}
            <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                <WorldIcon name={character.world_name} />
                <span className="text-xs sm:text-sm md:text-base">
                    {character.world_name}
                </span>
            </div>

            {/* 즐겨찾기 버튼 */}
            <div className="absolute top-2 right-2 z-10">
                <Button
                    variant="ghost"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); // 부모 onClick 방지
                        onToggleFavorite?.();
                    }}
                >
                    <Star
                        className={`h-5 w-5 ${
                            isFavorite ? "text-yellow-400" : "text-muted-foreground"
                        }`}
                        fill={isFavorite ? "currentColor" : "none"}
                    />
                </Button>
            </div>

            {/* 캐릭터 이미지 */}
            <div className="relative w-full aspect-[4/3] flex items-center justify-center">
                {character.image && (
                    <Image
                        src={`/api/crop?url=${encodeURIComponent(character.image)}`}
                        alt={character.character_name}
                        className="object-contain translate-y-4 h-auto"
                        width={100}
                        height={100}
                        priority
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
