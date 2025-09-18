import { create } from "zustand";
import { persist } from "zustand/middleware";
import { findCharacterBasic } from "@/fetchs/character.fetch";
import { findUserCharacterList } from "@/fetchs/user.fetch";
import { ICharacterSummary } from "@/interface/character/ICharacterSummary";
import { IUserCharacterList } from "@/interface/user/IUserCharacterList";
import { IUserResponse } from "@/interface/user/IUserResponse";

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
                const res: IUserResponse<IUserCharacterList> = await findUserCharacterList();
                const basicList = (res.data.characters ?? []).map((c) => ({
                    ocid: c.ocid,
                    character_name: c.character_name,
                    world_name: c.world_name,
                    character_class: c.character_class,
                    character_level: c.character_level,
                }));
                const sorted = basicList.sort((a, b) => b.character_level - a.character_level);
                set({ characters: sorted, loading: false });

                const images = await Promise.all(
                    sorted.map(async (char) => {
                        const data = await findCharacterBasic(char.ocid);
                        return { ocid: char.ocid, image: data.data.character_image };
                    })
                );

                const imageMap = new Map<string, string>(
                    images.map(({ ocid, image }) => [ocid, image])
                );

                set((state) => ({
                    characters: state.characters.map((c) =>
                        imageMap.has(c.ocid)
                            ? { ...c, image: imageMap.get(c.ocid) }
                            : c
                    ),
                }));
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

