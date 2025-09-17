'use client'

import { useRouter } from "next/navigation";
import { unstable_ViewTransition as ViewTransition, useEffect, useState } from "react";
import { supabase } from "@/libs/supabaseClient";
import CharacterInfo from "@/components/home/CharacterInfo";
import FavoriteList from "@/components/home/FavoriteList";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { findCharacterBasic } from "@/fetchs/character.fetch";
import { addFavorite, getFavorites, removeFavorite } from "@/fetchs/favorite.fetch";
import { ICharacterSummary } from "@/interface/character/ICharacterSummary";
import { favoriteStore } from "@/stores/favoriteStore";

const Home = () => {
    const router = useRouter();
    const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
    const [favorites, setFavorites] = useState<ICharacterSummary[]>([]);
    const { setFavorites: setFavoriteOcids, addFavorite: addFavoriteOcid, removeFavorite: removeFavoriteOcid } = favoriteStore();
    const [selected, setSelected] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

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
            setFavoriteOcids(favOcids);
            const chars = await Promise.all(
                favOcids.map(async (ocid) => {
                    const data = await findCharacterBasic(ocid);
                    return {
                        ocid,
                        character_name: data.data.character_name,
                        world_name: data.data.world_name,
                        character_class: data.data.character_class,
                        character_level: data.data.character_level,
                        image: data.data.character_image,
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
        if (favorites.find((f) => f.ocid === ocid)) {
            await removeFavorite(user.id, ocid);
            setFavorites(favorites.filter((f) => f.ocid !== ocid));
            removeFavoriteOcid(ocid);
            if (selected === ocid) setSelected(null);
        } else {
            await addFavorite(user.id, ocid);
            const data = await findCharacterBasic(ocid);
            setFavorites([
                ...favorites,
                {
                    ocid,
                    character_name: data.data.character_name,
                    world_name: data.data.world_name,
                    character_class: data.data.character_class,
                    character_level: data.data.character_level,
                    image: data.data.character_image,
                },
            ]);
            addFavoriteOcid(ocid);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSelect = (ocid: string) => {
        setSelected(ocid);
        // 모바일일 경우 다이얼로그 열기
        if (window.innerWidth < 768) {
            setOpen(true);
        }
    };

    const goToDetailPage = () => {
        router.push(`/character/${selected}`);
    };

    return (
        <ViewTransition enter="fade" exit="fade">
            <div className="flex h-full">
                {/* 캐릭터 목록 */}
                <FavoriteList
                    favorites={favorites}
                    loading={loading}
                    onSelect={handleSelect}
                    onToggleFavorite={toggleFavorite}
                />

                {/* 캐릭터 정보 */}
                <CharacterInfo ocid={selected} goToDetailPage={goToDetailPage} />

                {/* 모바일 다이얼로그 */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent
                        className="
                            fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                            w-[90vw] max-w-md max-h-[90vh] overflow-y-auto
                            rounded-2xl bg-background p-0 shadow-lg
                        "
                    >
                        <DialogTitle className="px-4 pt-4">Info</DialogTitle>
                        <CharacterInfo
                            ocid={selected}
                            goToDetailPage={goToDetailPage}
                            className="flex md:hidden max-h-[80vh]"
                        />
                    </DialogContent>

                </Dialog>

            </div>
        </ViewTransition>
    );
};

export default Home;
