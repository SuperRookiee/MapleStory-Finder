'use client'

import CharacterCard from "@/components/character/CharacterCard";
import CharacterCardSkeleton from "@/components/character/CharacterCardSkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ICharacterSummary } from "@/interface/character/ICharacterSummary";
import { cn } from "@/utils/utils";

interface IFavoriteListProps {
    favorites: ICharacterSummary[];
    loading: boolean;
    onSelect: (ocid: string) => void;
    onToggleFavorite: (ocid: string) => void;
    className?: string;
    emptyLabel?: string;
}

const FavoriteList = ({
    favorites,
    loading,
    onSelect,
    onToggleFavorite,
    className,
    emptyLabel = "",
}: IFavoriteListProps) => {
    return (
        <ScrollArea className={cn("h-full", className)}>
            <div className="space-y-4 px-4 py-4 sm:px-5">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <CharacterCardSkeleton key={i} />)
                ) : favorites.length > 0 ? (
                    favorites.map((c) => (
                        <CharacterCard
                            key={c.ocid}
                            character={c}
                            isFavorite
                            onToggleFavorite={() => onToggleFavorite(c.ocid)}
                            onSelect={() => onSelect(c.ocid)}
                        />
                    ))
                ) : (
                    <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-10 text-center text-sm text-muted-foreground">
                        {emptyLabel}
                    </div>
                )}
            </div>
        </ScrollArea>
    );
};

export default FavoriteList;
