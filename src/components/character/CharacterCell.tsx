"use client";

import { useRouter } from "next/navigation";
import { memo, useEffect, useRef } from "react";
import CharacterCard from "@/components/character/CharacterCard";
import { ICharacterSummary } from "@/interface/character/ICharacterSummary";

interface ICharacterCellProps {
    character: ICharacterSummary;
    favorites: string[];
    toggleFavorite: (ocid: string) => void;
    loadCharacterImage: (ocid: string) => Promise<void>;
    scrollContainer: HTMLElement | null;
}

const CharacterCell = memo(({
    character,
    favorites,
    toggleFavorite,
    loadCharacterImage,
    scrollContainer,
}: ICharacterCellProps) => {
    const router = useRouter();
    const cellRef = useRef<HTMLDivElement | null>(null);
    const requestedImageRef = useRef(false);

    useEffect(() => {
        requestedImageRef.current = Boolean(character.image);
    }, [character.ocid, character.image]);

    useEffect(() => {
        if (character.image || requestedImageRef.current) {
            return;
        }

        if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
            requestedImageRef.current = true;
            void loadCharacterImage(character.ocid);
            return;
        }

        const element = cellRef.current;
        if (!element) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        requestedImageRef.current = true;
                        observer.disconnect();
                        void loadCharacterImage(character.ocid);
                    }
                });
            },
            {
                root: scrollContainer ?? null,
                rootMargin: "0px 0px 300px 0px",
                threshold: 0,
            },
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [character.image, character.ocid, loadCharacterImage, scrollContainer]);

    return (
        <div ref={cellRef} className="p-2 w-full">
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

