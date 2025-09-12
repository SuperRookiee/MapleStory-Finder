import axios from "axios";
import { userStore } from "@/stores/userStore";
import { CharacterResponse } from "@/interface/CharacterResponse";
import { ICharacterSummary } from "@/interface/character/ICharacterSummary";
import { ICharacterAbility, ICharacterAndroidEquipment, ICharacterBasic, ICharacterBeautyEquipment, ICharacterCashItemEquipment, ICharacterDojang, ICharacterHexaMatrix, ICharacterHexaMatrixStat, ICharacterHyperStat, ICharacterItemEquipment, ICharacterLinkSkill, ICharacterOtherStat, ICharacterPetEquipment, ICharacterPopularity, ICharacterPropensity, ICharacterSetEffect, ICharacterSkill, ICharacterStat, ICharacterSymbolEquipment, ICharacterVMatrix, IRingExchangeSkillEquipment, } from "@/interface/character/ICharacter";

const delay = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

let requestQueue: Promise<unknown> = Promise.resolve();

export const findCharacterList = async () => {
    const apiKey = userStore.getState().user.apiKey;
    const response = await axios.get<CharacterResponse<{ characters: ICharacterSummary[] }>>(
        `/api/character/list`,
        {
            headers: { "x-nxopen-api-key": apiKey ?? "" },
        }
    );
    return response.data;
};

const callCharacterApi = async <T>(
    endpoint: string,
    params: Record<string, string | number | undefined> = {}
): Promise<CharacterResponse<T>> => {
    const apiKey = userStore.getState().user.apiKey;

    const task = async () => {
        await delay(200);
        const response = await axios.get<CharacterResponse<T>>(`/api/character/${endpoint}`, {
            headers: { "x-nxopen-api-key": apiKey ?? "" },
            params: Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v !== undefined)
            ),
        });
        return response.data;
    };

    const result = requestQueue.then(task);
    requestQueue = result.catch(() => undefined);
    return result;
};

/* ---------------- 기본 API ---------------- */
export const findCharacterBasic = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterBasic>("basic", { ocid, date });

export const findCharacterPopularity = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterPopularity>("popularity", { ocid, date });

export const findCharacterStat = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterStat>("stat", { ocid, date });

export const findCharacterHyperStat = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterHyperStat>("hyper-stat", { ocid, date });

export const findCharacterPropensity = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterPropensity>("propensity", { ocid, date });

export const findCharacterAbility = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterAbility>("ability", { ocid, date });

export const findCharacterItemEquipment = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterItemEquipment>("item-equipment", { ocid, date });

export const findCharacterCashItemEquipment = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterCashItemEquipment>("cashitem-equipment", { ocid, date });

export const findCharacterSymbolEquipment = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterSymbolEquipment>("symbol-equipment", { ocid, date });

export const findCharacterSetEffect = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterSetEffect>("set-effect", { ocid, date });

export const findCharacterBeautyEquipment = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterBeautyEquipment>("beauty-equipment", { ocid, date });

export const findCharacterAndroidEquipment = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterAndroidEquipment>("android-equipment", { ocid, date });

export const findCharacterPetEquipment = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterPetEquipment>("pet-equipment", { ocid, date });

/* ---------------- 스킬 API ---------------- */
// character_skill_grade 필수, date는 옵션
export const findCharacterSkill = (ocid: string, grade: string, date?: string) =>
    callCharacterApi<ICharacterSkill>("skill", { ocid, character_skill_grade: grade, date });

export const findCharacterLinkSkill = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterLinkSkill>("link-skill", { ocid, date });

export const findCharacterVMatrix = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterVMatrix>("vmatrix", { ocid, date });

export const findCharacterHexaMatrix = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterHexaMatrix>("hexamatrix", { ocid, date });

export const findCharacterHexaMatrixStat = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterHexaMatrixStat>("hexamatrix-stat", { ocid, date });

export const findCharacterDojang = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterDojang>("dojang", { ocid, date });

export const findCharacterOtherStat = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterOtherStat>("other-stat", { ocid, date });

export const findCharacterRingExchange = (ocid: string, date?: string) =>
    callCharacterApi<IRingExchangeSkillEquipment>("ring-exchange-skill-equipment", { ocid, date });

export const findCharacterId = (character_name: string) =>
    callCharacterApi<{ ocid: string }>("id", { character_name });