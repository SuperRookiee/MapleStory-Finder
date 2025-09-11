'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { findCharacterList } from "@/fetchs/character.fetch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addFavorite, getFavorites, removeFavorite } from "@/fetchs/favorite.fetch";
import CharacterCardSkeleton from "@/components/Character/CharacterCardSkeleton";
import CharacterCell from "@/components/Character/CharacterCell";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CharacterSummary {
    ocid: string;
    character_name: string;
    world_name: string;
    character_class: string;
    character_level: number;
}

interface CharacterListResponse {
    message: string;
    status: number;
    characters: CharacterSummary[];
}

const CharacterList = () => {
    const setApiKey = useUserStore((s) => s.setApiKey);
    const [characters, setCharacters] = useState<CharacterSummary[]>([]);
    const [displayCharacters, setDisplayCharacters] = useState<CharacterSummary[]>([]);
    const [worldFilter, setWorldFilter] = useState("전체월드");
    const [favorites, setFavorites] = useState<string[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const { data } = await supabase.auth.getSession();
            const session = data.session;

            if (!session) {
                setLoading(false);
                return;
            }

            setUserId(session.user.id);
            const key = session.user.user_metadata?.nexon_api_key;
            if (key) setApiKey(key);

            try {
                const res: CharacterListResponse = await findCharacterList();
                const list = res.characters ?? [];
                const sorted = list.sort((a, b) => b.character_level - a.character_level);

                setCharacters(sorted);
                setDisplayCharacters(sorted);
                setLoading(false);

                const favs = await getFavorites(session.user.id);
                setFavorites(favs);
            } catch (err) {
                if (err instanceof Error) toast.error(err.message);
                setLoading(false);
            }
        };

        load();
    }, [setApiKey]);

    // 서버 선택 필터링
    useEffect(() => {
        const filtered = characters.filter(
            (c) => worldFilter === "전체월드" || c.world_name === worldFilter
        );
        setDisplayCharacters(filtered);
    }, [characters, worldFilter]);

    const toggleFavorite = async (ocid: string) => {
        if (!userId) return;
        if (favorites.includes(ocid)) {
            await removeFavorite(userId, ocid);
            setFavorites(favorites.filter((f) => f !== ocid));
        } else {
            await addFavorite(userId, ocid);
            setFavorites([...favorites, ocid]);
        }
    };

    const worlds = ["전체월드", ...Array.from(new Set(characters.map((c) => c.world_name)))];

    return (
        <div className="flex h-[calc(100vh-var(--header-height))] flex-col">
            {/* 서버 선택 */}
            <Select value={worldFilter} onValueChange={setWorldFilter}>
                <SelectTrigger className="mb-4 w-[180px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {worlds.map((world) => (
                        <SelectItem key={world} value={world}>
                            {world}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {loading ? (
                <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <CharacterCardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <ScrollArea className="w-full flex-1 rounded-md border p-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {displayCharacters.map((character) => (
                            <CharacterCell
                                key={character.ocid}
                                character={character}
                                favorites={favorites}
                                toggleFavorite={toggleFavorite}
                            />
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
};

export default CharacterList;