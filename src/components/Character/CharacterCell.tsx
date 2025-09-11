import { type CellComponentProps } from "react-window";
import CharacterCard from "@/components/Character/CharacterCard";

interface CharacterSummary {
    ocid: string;
    character_name: string;
    world_name: string;
    character_class: string;
    character_level: number;
}

function CharacterCell({
                           columnIndex,
                           rowIndex,
                           style,
                           characters,
                           favorites,
                           toggleFavorite,
                       }: CellComponentProps<{
    characters: CharacterSummary[];
    favorites: string[];
    toggleFavorite: (ocid: string) => void;
}>) {
    const index = rowIndex * 3 + columnIndex;
    const character = characters[index];
    if (!character) return null;

    return (
        <div style={style} className="p-2">
            <CharacterCard
                key={character.ocid}
                character={character}
                isFavorite={favorites.includes(character.ocid)}
                onToggleFavorite={() => toggleFavorite(character.ocid)}
            />
        </div>
    );
}

export default CharacterCell;