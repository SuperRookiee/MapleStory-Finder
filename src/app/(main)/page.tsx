'use client'

import { unstable_ViewTransition as ViewTransition, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import CharacterCard from "@/components/character/CharacterCard";
import CharacterCardSkeleton from "@/components/character/CharacterCardSkeleton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { addFavorite, getFavorites, removeFavorite } from "@/fetchs/favorite.fetch";
import { findCharacterBasic } from "@/fetchs/character.fetch";
import { ICharacterSummary } from "@/interface/ICharacterSummary";

const Home = () => {
    const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
    const [favorites, setFavorites] = useState<ICharacterSummary[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const selectedCharacter = favorites.find((f) => f.ocid === selected);

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
        if (favorites.find((f) => f.ocid === ocid)) {
            await removeFavorite(user.id, ocid);
            setFavorites(favorites.filter((f) => f.ocid !== ocid));
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

    const handleSelect = (ocid: string) => {
        setSelected(ocid);
        // 모바일일 경우 다이얼로그 열기
        if (window.innerWidth < 768) {
            setOpen(true);
        }
    };

    const handleDetail = () => {
        if (!selected) return;
        console.log(selected)
        router.push(`/character/${selected}`);
    };

    return (
        <ViewTransition enter="fade" exit="fade">
            <div className="flex h-full">
                {/* 좌측 영역: 항상 표시 */}
                <ScrollArea className="w-full md:w-1/3 border-r p-4">
                    <div className="space-y-4">
                        {loading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                <CharacterCardSkeleton key={i}/>
                            ))
                            : favorites.map((c) => (
                                <CharacterCard
                                    key={c.ocid}
                                    character={c}
                                    isFavorite
                                    onToggleFavorite={() => toggleFavorite(c.ocid)}
                                    onSelect={() => handleSelect(c.ocid)}
                                />
                            ))}
                    </div>
                </ScrollArea>

                {/* 우측 영역: md 이상에서만 표시 */}
                <ScrollArea className="hidden md:flex flex-1">
                    {selectedCharacter ? (
                        <div className="p-4 space-y-4 max-w-2xl mx-auto">
                            {selectedCharacter.image && (
                                <div className="relative w-64 h-64 mx-auto">
                                    <Image
                                        src={selectedCharacter.image}
                                        alt={selectedCharacter.character_name}
                                        fill
                                        className="object-contain"
                                        style={{
                                            viewTransitionName: `character-image-${selectedCharacter.ocid}`,
                                        }}
                                        sizes="256px"
                                    />
                                </div>
                            )}
                            <h2 className="text-2xl font-bold text-center">
                                {selectedCharacter.character_name}
                            </h2>
                            <p className="text-center text-muted-foreground">
                                {selectedCharacter.character_class}
                            </p>
                            <p className="text-center font-bold text-red-500">
                                Lv. {selectedCharacter.character_level}
                            </p>
                            <div className="flex justify-center">
                                <Button onClick={handleDetail}>Detail</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center w-full h-page animate-pulse ">
                            Please choose your character
                        </div>
                    )}
                </ScrollArea>

                {/* 모바일 다이얼로그 */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-sm sm:max-w-md">
                        {selectedCharacter && (
                            <>
                                <DialogHeader>
                                    <DialogTitle>{selectedCharacter.character_name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    {selectedCharacter.image && (
                                        <div className="relative w-40 h-40 mx-auto">
                                            <Image
                                                src={selectedCharacter.image}
                                                alt={selectedCharacter.character_name}
                                                fill
                                                className="object-contain"
                                                sizes="160px"
                                            />
                                        </div>
                                    )}
                                    <p className="text-center text-muted-foreground">
                                        {selectedCharacter.character_class}
                                    </p>
                                    <p className="text-center font-bold text-red-500">
                                        Lv. {selectedCharacter.character_level}
                                    </p>
                                    <div className="flex justify-center">
                                        <Button onClick={handleDetail}>Detail</Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </ViewTransition>
    );
};

export default Home;
