import axios from "axios";
import { useUserStore } from "@/store/userStore";

const delay = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

let requestQueue: Promise<unknown> = Promise.resolve();

export const findCharacterList = async () => {
    const apiKey = useUserStore.getState().user.apiKey;
    const response = await axios.get(`/api/character/list`, {
        headers: { "x-nxopen-api-key": apiKey ?? "" },
    });
    return response.data;
};

const callCharacterApi = async (
    endpoint: string,
    params: Record<string, string | number | undefined> = {}
) => {
    const apiKey = useUserStore.getState().user.apiKey;

    const task = async () => {
        await delay(200);
        const response = await axios.get(`/api/character/${endpoint}`, {
            headers: { "x-nxopen-api-key": apiKey ?? "" },
            params: Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined)),
        });
        return response.data;
    };

    const result = requestQueue.then(task);
    requestQueue = result.catch(() => undefined);
    return result;
};

/* ---------------- 기본 API ---------------- */
export const findCharacterBasic = (ocid: string, date?: string) =>
    callCharacterApi("basic", { ocid, date });

export const findCharacterPopularity = (ocid: string, date?: string) =>
    callCharacterApi("popularity", { ocid, date });

export const findCharacterStat = (ocid: string, date?: string) =>
    callCharacterApi("stat", { ocid, date });

export const findCharacterHyperStat = (ocid: string, date?: string) =>
    callCharacterApi("hyper-stat", { ocid, date });

export const findCharacterPropensity = (ocid: string, date?: string) =>
    callCharacterApi("propensity", { ocid, date });

export const findCharacterAbility = (ocid: string, date?: string) =>
    callCharacterApi("ability", { ocid, date });

export const findCharacterItemEquipment = (ocid: string, date?: string) =>
    callCharacterApi("item-equipment", { ocid, date });

export const findCharacterCashItemEquipment = (ocid: string, date?: string) =>
    callCharacterApi("cashitem-equipment", { ocid, date });

export const findCharacterSymbolEquipment = (ocid: string, date?: string) =>
    callCharacterApi("symbol-equipment", { ocid, date });

export const findCharacterSetEffect = (ocid: string, date?: string) =>
    callCharacterApi("set-effect", { ocid, date });

export const findCharacterBeautyEquipment = (ocid: string, date?: string) =>
    callCharacterApi("beauty-equipment", { ocid, date });

export const findCharacterAndroidEquipment = (ocid: string, date?: string) =>
    callCharacterApi("android-equipment", { ocid, date });

export const findCharacterPetEquipment = (ocid: string, date?: string) =>
    callCharacterApi("pet-equipment", { ocid, date });

/* ---------------- 스킬 API ---------------- */
// character_skill_grade 필수, date는 옵션
export const findCharacterSkill = (ocid: string, grade: string, date?: string) =>
    callCharacterApi("skill", { ocid, character_skill_grade: grade, date, });

export const findCharacterLinkSkill = (ocid: string, date?: string) =>
    callCharacterApi("link-skill", { ocid, date });

export const findCharacterVMatrix = (ocid: string, date?: string) =>
    callCharacterApi("vmatrix", { ocid, date });

export const findCharacterHexaMatrix = (ocid: string, date?: string) =>
    callCharacterApi("hexamatrix", { ocid, date });

export const findCharacterHexaMatrixStat = (ocid: string, date?: string) =>
    callCharacterApi("hexamatrix-stat", { ocid, date });

export const findCharacterDojang = (ocid: string, date?: string) =>
    callCharacterApi("dojang", { ocid, date });

export const findCharacterOtherStat = (ocid: string, date?: string) =>
    callCharacterApi("other-stat", { ocid, date });

export const findCharacterRingExchange = (ocid: string, date?: string) =>
    callCharacterApi("ring-exchange-skill-equipment", { ocid, date });

export const findCharacterId = (character_name: string) =>
    callCharacterApi("id", { character_name });