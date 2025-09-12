'use client'

import CharacterCard from "@/components/character/CharacterCard";
import CharacterCardSkeleton from "@/components/character/CharacterCardSkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ICharacterSummary } from "@/interface/character/ICharacterSummary";

interface IFavoriteListProps {
    favorites: ICharacterSummary[];
    loading: boolean;
    onSelect: (ocid: string) => void;
    onToggleFavorite: (ocid: string) => void;
}

const FavoriteList = ({ favorites, loading, onSelect, onToggleFavorite }: IFavoriteListProps) => {
    return (
        <ScrollArea className="w-full md:w-1/3 md:border-r p-4">
            <div className="space-y-4">
                {loading
                    ? Array.from({ length: 3 }).map((_, i) => <CharacterCardSkeleton key={i} />)
                    : favorites.map((c) => (
                        <CharacterCard
                            key={c.ocid}
                            character={c}
                            isFavorite
                            onToggleFavorite={() => onToggleFavorite(c.ocid)}
                            onSelect={() => onSelect(c.ocid)}
                        />
                    ))}
            </div>
        </ScrollArea>
    );
};

export default FavoriteList;
