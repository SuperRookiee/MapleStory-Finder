import { useRouter } from "next/navigation";
import { memo } from "react";
import CharacterCard from "@/components/character/CharacterCard";
import { ICharacterSummary } from "@/interface/character/ICharacterSummary";

interface ICharacterCellProps {
    character: ICharacterSummary;
    favorites: string[];
    toggleFavorite: (ocid: string) => void;
}

const CharacterCell = memo(({ character, favorites, toggleFavorite }: ICharacterCellProps) => {
    const router = useRouter();

    return (
        <div className="p-2 w-full">
            <CharacterCard
                character={character}
                isFavorite={favorites.includes(character.ocid)}
                onToggleFavorite={() => toggleFavorite(character.ocid)}
                onSelect={() => router.push(`/character/${character.ocid}`)}
            />
        </div>
    );
});

CharacterCell.displayName = "CharacterCell";

export default CharacterCell;

