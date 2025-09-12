import { create } from "zustand";
import { persist } from "zustand/middleware";
import { findCharacterBasic, findCharacterList } from "@/fetchs/character.fetch";
import { ICharacterSummary } from "@/interface/character/ICharacterSummary";
import { CharacterResponse } from "@/interface/CharacterResponse";

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
                const res: CharacterResponse<{ characters: ICharacterSummary[] }> = await findCharacterList();
                const basicList = (res.data.characters ?? []).map((c) => ({
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
                                c.ocid === char.ocid ? { ...c, image: data.data.character_image } : c
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

