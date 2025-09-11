'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CharacterCard from "@/components/characterCard";
import CharacterDetail from "@/components/characterDetail";
import { findCharacterBasic } from "@/fetch/character.fetch";
import { getFavorites, addFavorite, removeFavorite } from "@/fetch/favorite.fetch";
import CharacterCardSkeleton from "@/components/characterCardSkeleton";

interface ICharacterSummary {
    ocid: string;
    character_name: string;
    world_name: string;
    character_class: string;
    character_level: number;
    image?: string;
}

const Home = () => {
    const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
    const [favorites, setFavorites] = useState<ICharacterSummary[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
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

            setUser({ id: session.user.id, email: session.user.email ?? undefined });
            const favOcids = await getFavorites(session.user.id);
            const chars = await Promise.all(
                favOcids.map(async (ocid) => {
                    const data = await findCharacterBasic(ocid);
                    return {
                        ocid,
                        character_name: data.character_name,
                        world_name: data.world_name,
                        character_class: data.character_class,
                        character_level: data.character_level,
                        image: data.character_image,
                    } as ICharacterSummary;
                })
            );
            setFavorites(chars);
            setLoading(false);
        };

        load();
    }, []);

    const toggleFavorite = async (ocid: string) => {
        if (!user) return;
        if (favorites.find(f => f.ocid === ocid)) {
            await removeFavorite(user.id, ocid);
            setFavorites(favorites.filter(f => f.ocid !== ocid));
            if (selected === ocid) setSelected(null);
        } else {
            await addFavorite(user.id, ocid);
            const data = await findCharacterBasic(ocid);
            setFavorites([
                ...favorites,
                {
                    ocid,
                    character_name: data.character_name,
                    world_name: data.world_name,
                    character_class: data.character_class,
                    character_level: data.character_level,
                    image: data.character_image,
                },
            ]);
        }
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/3 border-r overflow-y-auto p-4">
                <div className="mb-4">
                    <p className="font-bold">{user?.email}</p>
                </div>
                <div className="space-y-4">
                    {loading
                        ? Array.from({ length: 3 }).map((_, i) => <CharacterCardSkeleton key={i} />)
                        : favorites.map((c) => (
                              <CharacterCard
                                  key={c.ocid}
                                  character={c}
                                  isFavorite
                                  onToggleFavorite={() => toggleFavorite(c.ocid)}
                                  onSelect={() => setSelected(c.ocid)}
                              />
                          ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {selected ? (
                    <CharacterDetail ocid={selected} />
                ) : (
                    <div className="p-4">캐릭터를 선택하세요</div>
                )}
            </div>
        </div>
    );
};

export default Home;
