import CharacterCard from "@/components/Character/CharacterCard";
import { useRouter } from "next/navigation";

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

const CharacterCell = ({ character, favorites, toggleFavorite }: Props) => {
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
    )
};

export default CharacterCell;

