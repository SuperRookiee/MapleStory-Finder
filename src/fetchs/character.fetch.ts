import axios, { AxiosError } from "axios";
import pLimit from "p-limit";
import { ICharacterAbility, ICharacterAndroidEquipment, ICharacterBasic, ICharacterBeautyEquipment, ICharacterCashItemEquipment, ICharacterDojang, ICharacterHexaMatrix, ICharacterHexaMatrixStat, ICharacterHyperStat, ICharacterItemEquipment, ICharacterLinkSkill, ICharacterOtherStat, ICharacterPetEquipment, ICharacterPopularity, ICharacterPropensity, ICharacterSetEffect, ICharacterSkill, ICharacterStat, ICharacterSymbolEquipment, ICharacterVMatrix, IRingExchangeSkillEquipment, } from "@/interface/character/ICharacter";
import { ICharacterResponse } from "@/interface/character/ICharacterResponse";
import { ICharacterSummary } from "@/interface/character/ICharacterSummary";
import { userStore } from "@/stores/userStore";

const limit = pLimit(5);

export const findCharacterList = async () => {
    const apiKey = userStore.getState().user.apiKey;
    try {
        const response = await axios.get<ICharacterResponse<{ characters: ICharacterSummary[] }>>(
            `/api/character/list`,
            {
                headers: { "x-nxopen-api-key": apiKey ?? "" },
            }
        );
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError && err.response?.data?.error?.message === "Missing API Key") {
            if (typeof window !== "undefined") {
                window.location.href = "/my_page?missingApiKey=1";
            }
        }
        throw err;
    }
};

const callCharacterApi = async <T>(
    endpoint: string,
    params: Record<string, string | number | undefined> = {},
): Promise<ICharacterResponse<T>> => {
    const apiKey = userStore.getState().user.apiKey;

    return limit(async () => {
        try {
            const response = await axios.get<ICharacterResponse<T>>(`/api/character/${endpoint}`, {
                headers: { "x-nxopen-api-key": apiKey ?? "" },
                params: Object.fromEntries(
                    Object.entries(params).filter(([, v]) => v !== undefined),
                ),
            });
            return response.data;
        } catch (err) {
            if (err instanceof AxiosError && err.response?.data?.error?.message === "Missing API Key") {
                if (typeof window !== "undefined") {
                    window.location.href = "/my_page?missingApiKey=1";
                }
            }
            throw err;
        }
    });
};

const callApi = async <T>(
    endpoint: string,
    params: Record<string, string | number | undefined> = {},
): Promise<ICharacterResponse<T>> => {
    const apiKey = userStore.getState().user.apiKey;

    return limit(async () => {
        try {
            const response = await axios.get(`/api/${endpoint}`, {
                headers: { "x-nxopen-api-key": apiKey ?? "" },
                params: Object.fromEntries(
                    Object.entries(params).filter(([, v]) => v !== undefined),
                ),
            });
            return response.data;
        } catch (err) {
            if (err instanceof AxiosError && err.response?.data?.error?.message === "Missing API Key") {
                if (typeof window !== "undefined") {
                    window.location.href = "/my_page?missingApiKey=1";
                }
            }
            throw err;
        }
    });
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
    callApi<{ ocid: string }>("id", { character_name });
