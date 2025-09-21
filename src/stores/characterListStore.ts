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
    loadCharacterImage: (ocid: string) => Promise<void>;
}

const pendingImageRequests = new Map<string, Promise<void>>();

export const characterListStore = create<CharacterListSlice>()(persist((set, get) => ({
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
                const previousImages = new Map(get().characters.map((c) => [c.ocid, c.image]));

                const merged = sorted.map((character) => ({
                    ...character,
                    image: previousImages.get(character.ocid),
                }));

                set({ characters: merged, loading: false });
            } catch (err) {
                set({ loading: false });
                throw err;
            }
        },
        loadCharacterImage: async (ocid: string) => {
            const { characters } = get();
            const target = characters.find((c) => c.ocid === ocid);

            if (!target || target.image) {
                return;
            }

            const existingRequest = pendingImageRequests.get(ocid);
            if (existingRequest) {
                await existingRequest;
                return;
            }

            const request = (async () => {
                try {
                    const data = await findCharacterBasic(ocid);
                    const image = data.data.character_image;

                    set((state) => ({
                        characters: state.characters.map((character) =>
                            character.ocid === ocid ? { ...character, image } : character,
                        ),
                    }));
                } finally {
                    pendingImageRequests.delete(ocid);
                }
            })();

            pendingImageRequests.set(ocid, request);
            await request;
        },
    }),
    {
        name: "characterListStore",
    }
));

