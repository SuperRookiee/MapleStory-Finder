import { create } from "zustand";
import { ICharacterSummary } from "@/interface/ICharacterSummary";
import { findCharacterList, findCharacterBasic } from "@/fetchs/character.fetch";

interface ICharacterListResponse {
    message: string;
    status: number;
    characters: ICharacterSummary[];
}

interface CharacterListState {
    characters: ICharacterSummary[];
    loading: boolean;
    fetchCharacters: () => Promise<void>;
}

export const useCharacterListStore = create<CharacterListState>((set) => ({
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
                    try {
                        const data = await findCharacterBasic(char.ocid);
                        set((state) => ({
                            characters: state.characters.map((c) =>
                                c.ocid === char.ocid ? { ...c, image: data.character_image } : c
                            ),
                        }));
                    } catch {
                        // ignore individual image load errors
                    }
                }
            };

            loadImages();
        } catch (err) {
            set({ loading: false });
            throw err;
        }
    },
}));

