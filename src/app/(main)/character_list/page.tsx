'use client'

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/libs/supabaseClient";
import CharacterCardSkeleton from "@/components/character/CharacterCardSkeleton";
import CharacterCell from "@/components/character/CharacterCell";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { addFavorite, getFavorites, removeFavorite } from "@/fetchs/favorite.fetch";
import { ICharacterSummary } from "@/interface/character/ICharacterSummary";
import { characterListStore } from "@/stores/characterListStore";
import { favoriteStore } from "@/stores/favoriteStore";
import { userStore } from "@/stores/userStore";

const CharacterList = () => {
    const setApiKey = userStore((s) => s.setApiKey);
    const { characters, loading, fetchCharacters } = characterListStore();
    const [displayCharacters, setDisplayCharacters] = useState<ICharacterSummary[]>([]);
    const [worldFilter, setWorldFilter] = useState("전체월드");
    const [searchKeyword, setSearchKeyword] = useState("");
    const { favorites, setFavorites, addFavorite: addFavoriteOcid, removeFavorite: removeFavoriteOcid } = favoriteStore();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const { data } = await supabase.auth.getSession();
            const session = data.session;

            if (!session) {
                return;
            }

            setUserId(session.user.id);
            const key = session.user.user_metadata?.nexon_api_key;
            if (key) setApiKey(key);

            try {
                await fetchCharacters();
                const currentFavorites = favoriteStore.getState().favorites;
                if (currentFavorites.length === 0) {
                    const favorite = await getFavorites(session.user.id);
                    setFavorites(favorite);
                }
            } catch (err) {
                if (err instanceof Error) toast.error(err.message);
            }
        };

        load();
    }, [fetchCharacters, setApiKey, setFavorites]);

    // 서버 선택 필터링
    useEffect(() => {
        const keyword = searchKeyword.trim().toLowerCase();
        const filtered = characters.filter((c) => {
            const matchesWorld = worldFilter === "전체월드" || c.world_name === worldFilter;
            const matchesKeyword = c.character_name.toLowerCase().includes(keyword);

            return matchesWorld && matchesKeyword;
        });
        setDisplayCharacters(filtered);
    }, [characters, worldFilter, searchKeyword]);

    const toggleFavorite = useCallback(async (ocid: string) => {
        if (!userId) return;
        if (favorites.includes(ocid)) {
            await removeFavorite(userId, ocid);
            removeFavoriteOcid(ocid);
        } else {
            await addFavorite(userId, ocid);
            addFavoriteOcid(ocid);
        }
    }, [userId, favorites, addFavoriteOcid, removeFavoriteOcid]);

    const worlds = useMemo(
        () => ["전체월드", ...Array.from(new Set(characters.map((c) => c.world_name)))],
        [characters],
    );

    return (
        <div className="flex h-[calc(100vh-var(--header-height))] flex-col">
            {/* 서버 선택 */}
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                {loading ? (
                    <Skeleton className="h-10 w-[180px]" />
                ) : (
                    <Select value={worldFilter} onValueChange={setWorldFilter}>
                        <SelectTrigger className="w-[180px]">
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
                )}
                {loading ? (
                    <Skeleton className="h-10 w-full sm:w-[240px]" />
                ) : (
                    <Input
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="캐릭터 이름 검색"
                        className="w-full sm:w-[240px]"
                    />
                )}
            </div>

            {loading ? (
                <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <CharacterCardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <div className="w-full flex-1 overflow-y-auto rounded-md border">
                    <div className="grid grid-cols-1 gap-4 p-2 sm:grid-cols-2 md:grid-cols-3">
                        {displayCharacters.map((character) => (
                            <CharacterCell
                                key={character.ocid}
                                character={character}
                                favorites={favorites}
                                toggleFavorite={toggleFavorite}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CharacterList;
