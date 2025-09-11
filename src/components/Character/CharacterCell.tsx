import CharacterCard from "@/components/Character/CharacterCard";

interface CharacterSummary {
    ocid: string;
    character_name: string;
    world_name: string;
    character_class: string;
    character_level: number;
}

interface Props {
    character: CharacterSummary;
    favorites: string[];
    toggleFavorite: (ocid: string) => void;
}

const CharacterCell = ({ character, favorites, toggleFavorite }: Props) => (
    <div className="p-2 w-full">
        <CharacterCard
            character={character}
            isFavorite={favorites.includes(character.ocid)}
            onToggleFavorite={() => toggleFavorite(character.ocid)}
        />
    </div>
);

export default CharacterCell;

