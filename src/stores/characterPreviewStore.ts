import { create } from "zustand";
import { ICharacterBasic } from "@/interface/character/ICharacter";

type CharacterPreviewState = {
    ocid: string | null;
    basic: ICharacterBasic | null;
    setPreview: (ocid: string, basic: ICharacterBasic) => void;
    clear: () => void;
};

export const useCharacterPreviewStore = create<CharacterPreviewState>()((set) => ({
    ocid: null,
    basic: null,
    setPreview: (ocid, basic) => set({ ocid, basic }),
    clear: () => set({ ocid: null, basic: null }),
}));
