import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ICharacterSummary } from "@/interface/ICharacterSummary";
import { findCharacterBasic, findCharacterList } from "@/fetchs/character.fetch";
import { ICharacterListResponse } from "@/interface/ICharacterListResponse";

type CharacterListSlice = {
    characters: ICharacterSummary[];
    loading: boolean;
    fetchCharacters: () => Promise<void>;
}

export const characterListStore = create<CharacterListSlice>()(persist((set) => ({
        characters: [],
        loading: false,
        fetchCharacters: async () => {
            set({ loading: true });
            try {
                const res: ICharacterListResponse = await findCharacterList();
                const basicList = (res.characters ?? []).map((c) => ({
                    ocid: c.ocid,
                    character_name: c.character_name,
                    world_name: c.world_name,
                    character_class: c.character_class,
                    character_level: c.character_level,
                }));
                const sorted = basicList.sort((a, b) => b.character_level - a.character_level);
                set({ characters: sorted, loading: false });

                const loadImages = async () => {
                    for (const char of sorted) {
                        const data = await findCharacterBasic(char.ocid);
                        set((state) => ({
                            characters: state.characters.map((c) =>
                                c.ocid === char.ocid ? { ...c, image: data.character_image } : c
                            ),
                        }));
                    }
                };

                await loadImages();
            } catch (err) {
                set({ loading: false });
                throw err;
            }
        },
    }),
    {
        name: "characterListStore",
    }
));

