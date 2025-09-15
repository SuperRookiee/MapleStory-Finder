import { create } from "zustand";
import { persist } from "zustand/middleware";
import { findCharacterBasic, findCharacterList } from "@/fetchs/character.fetch";
import { ICharacterResponse } from "@/interface/character/ICharacterResponse";
import { ICharacterSummary } from "@/interface/character/ICharacterSummary";

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
                const res: ICharacterResponse<{ characters: ICharacterSummary[] }> = await findCharacterList();
                const basicList = (res.data.characters ?? []).map((c) => ({
                    ocid: c.ocid,
                    character_name: c.character_name,
                    world_name: c.world_name,
                    character_class: c.character_class,
                    character_level: c.character_level,
                }));
                const sorted = basicList.sort((a, b) => b.character_level - a.character_level);
                set({ characters: sorted, loading: false });

                await Promise.all(
                    sorted.map(async (char) => {
                        const data = await findCharacterBasic(char.ocid);
                        set((state) => ({
                            characters: state.characters.map((c) =>
                                c.ocid === char.ocid ? { ...c, image: data.data.character_image } : c
                            ),
                        }));
                    })
                );
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

