import { create } from "zustand";
import {
    findCharacterAbility,
    findCharacterAndroidEquipment,
    findCharacterBasic,
    findCharacterBeautyEquipment,
    findCharacterCashItemEquipment,
    findCharacterDojang,
    findCharacterHexaMatrix,
    findCharacterHexaMatrixStat,
    findCharacterHyperStat,
    findCharacterItemEquipment,
    findCharacterLinkSkill,
    findCharacterOtherStat,
    findCharacterPetEquipment,
    findCharacterPopularity,
    findCharacterPropensity,
    findCharacterRingExchange,
    findCharacterSetEffect,
    findCharacterSkill,
    findCharacterStat,
    findCharacterSymbolEquipment,
    findCharacterVMatrix,
} from "@/fetchs/character.fetch";
import { ICharacterResponse } from "@/interface/ICharacterResponse";
import { IStage1Data, IStage2Data, IStage3Data, IStage4Data } from "@/interface/character";

interface CharacterState {
    basic: Pick<ICharacterResponse, "character_image" | "character_name"> | null;
    stage1: IStage1Data;
    stage2: IStage2Data;
    stage3: IStage3Data;
    stage4: IStage4Data;
    loadCharacter: (ocid: string) => Promise<void>;
    reset: () => void;
}

export const useCharacterStore = create<CharacterState>((set) => ({
    basic: null,
    stage1: {},
    stage2: {},
    stage3: {},
    stage4: {},
    loadCharacter: async (ocid: string) => {
        if (!ocid) return;
        try {
            const [basicRes, stat, popularity, hyper] = await Promise.all([
                findCharacterBasic(ocid),
                findCharacterStat(ocid),
                findCharacterPopularity(ocid),
                findCharacterHyperStat(ocid),
            ]);
            set({ basic: basicRes, stage1: { stat, popularity, hyper } });

            const grades = ["0", "1", "2", "3", "4", "5", "6", "hyperpassive", "hyperactive"];
            const [itemEquip, cashEquip, symbolEquip, setEffect, skill, linkSkill] = await Promise.all([
                findCharacterItemEquipment(ocid),
                findCharacterCashItemEquipment(ocid),
                findCharacterSymbolEquipment(ocid),
                findCharacterSetEffect(ocid),
                Promise.all(grades.map((g) => findCharacterSkill(ocid, g))),
                findCharacterLinkSkill(ocid),
            ]);
            set({ stage2: { itemEquip, cashEquip, symbolEquip, setEffect, skill, linkSkill } });

            const [hexaMatrix, hexaStat, vMatrix, dojang, ring, otherStat] = await Promise.all([
                findCharacterHexaMatrix(ocid),
                findCharacterHexaMatrixStat(ocid),
                findCharacterVMatrix(ocid),
                findCharacterDojang(ocid),
                findCharacterRingExchange(ocid),
                findCharacterOtherStat(ocid),
            ]);
            set({ stage3: { hexaMatrix, hexaStat, vMatrix, dojang, ring, otherStat } });

            const [beauty, android, pet, propensity, ability] = await Promise.all([
                findCharacterBeautyEquipment(ocid),
                findCharacterAndroidEquipment(ocid),
                findCharacterPetEquipment(ocid),
                findCharacterPropensity(ocid),
                findCharacterAbility(ocid),
            ]);
            set({ stage4: { beauty, android, pet, propensity, ability } });
        } catch (err) {
            console.error("캐릭터 정보 로딩 실패:", err);
        }
    },
    reset: () => set({ basic: null, stage1: {}, stage2: {}, stage3: {}, stage4: {} }),
}));

