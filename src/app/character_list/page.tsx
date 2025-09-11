'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { findCharacterList, findCharacterBasic } from "@/fetch/character.fetch";
import CharacterCard from "@/components/characterCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFavorites, addFavorite, removeFavorite } from "@/fetch/favorite.fetch";

interface ICharacterSummary {
    ocid: string;
    character_name: string;
    world_name: string;
    character_class: string;
    character_level: number;
    image?: string;
}

const CharacterList = () => {
    const router = useRouter();
    const setApiKey = useUserStore((s) => s.setApiKey);
    const [characters, setCharacters] = useState<ICharacterSummary[]>([]);
    const [displayCharacters, setDisplayCharacters] = useState<ICharacterSummary[]>([]);
    const [worldFilter, setWorldFilter] = useState("전체월드");
    const [favorites, setFavorites] = useState<string[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const { data } = await supabase.auth.getSession();
            const session = data.session;

            if (!session) {
                router.push("/sign_in");
                return;
            }

            setUserId(session.user.id);
            const key = session.user.user_metadata?.nexon_api_key;
            if (key) setApiKey(key);

            try {
                findCharacterList().then((data: { characters: ICharacterSummary[] }) => {
                    const sorted = data.characters.sort((a, b) => b.character_level - a.character_level);
                    setCharacters(sorted);
                });
                const favs = await getFavorites(session.user.id);
                setFavorites(favs);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    toast.error(err.message);
                }
            }
        };

        load();
    }, [router, setApiKey]);

    useEffect(() => {
        const filtered = characters.filter(c => worldFilter === "전체월드" || c.world_name === worldFilter);
        Promise.all(
            filtered.map(async c => {
                try {
                    const data = await findCharacterBasic(c.ocid);
                    return { ...c, image: data.character_image };
                } catch {
                    return c;
                }
            })
        ).then(setDisplayCharacters);
    }, [characters, worldFilter]);

    const toggleFavorite = async (ocid: string) => {
        if (!userId) return;
        if (favorites.includes(ocid)) {
            await removeFavorite(userId, ocid);
            setFavorites(favorites.filter(f => f !== ocid));
        } else {
            await addFavorite(userId, ocid);
            setFavorites([...favorites, ocid]);
        }
    };

    const worlds = ["전체월드", ...Array.from(new Set(characters.map(c => c.world_name)))]

    return (
        <div className="p-4">
            <Select value={worldFilter} onValueChange={setWorldFilter}>
                <SelectTrigger className="mb-4 w-[180px]">
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    {worlds.map(world => (
                        <SelectItem key={world} value={world}>{world}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {displayCharacters.map((c) => (
                    <CharacterCard
                        key={c.ocid}
                        character={c}
                        isFavorite={favorites.includes(c.ocid)}
                        onToggleFavorite={() => toggleFavorite(c.ocid)}
                    />
                ))}
            </div>
        </div>
    )
}

export default CharacterList;
