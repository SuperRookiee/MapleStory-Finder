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
}

const CharacterCard = ({
    character,
    isFavorite,
    onToggleFavorite,
    onSelect,
}: ICharacterCardProps) => {
    return (
        <Card
            className={cn(
                "group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
                onSelect && "cursor-pointer",
            )}
            onClick={onSelect}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <WorldIcon name={character.world_name} />
                    <span className="truncate">{character.world_name}</span>
                </div>
                <Button
                    variant="ghost"
                    className="h-9 w-9 rounded-full border border-border/60 bg-background/80 p-0 text-muted-foreground shadow-sm transition-colors hover:bg-primary/10 hover:text-primary"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleFavorite?.();
                    }}
                    aria-label="Toggle favorite"
                >
                    <Star
                        className={cn("h-4 w-4 transition-colors", isFavorite && "text-primary")}
                        fill={isFavorite ? "currentColor" : "none"}
                    />
                </Button>
            </div>

            <div className="relative mt-6 flex h-32 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border/40 bg-muted/20 p-3 sm:h-36">
                {character.image && (
                    <Image
                        src={`/api/crop?url=${encodeURIComponent(character.image)}`}
                        alt={character.character_name}
                        className="h-full w-auto max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                        width={144}
                        height={144}
                        priority
                    />
                )}
            </div>

            <div className="mt-6 flex items-end justify-between gap-4">
                <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-foreground">
                        {character.character_name}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                        {character.character_class}
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">Lv.</span>
                    <span className="text-2xl font-semibold text-primary">
                        {character.character_level}
                    </span>
                </div>
            </div>
        </Card>
    );
};

export default CharacterCard;
