import { createApiCaller, createRequestRunner, type ApiParams } from "@/fetchs/apiClient";
import { ICharacterAbility, ICharacterAndroidEquipment, ICharacterBasic, ICharacterBeautyEquipment, ICharacterCashItemEquipment, ICharacterDojang, ICharacterHexaMatrix, ICharacterHexaMatrixStat, ICharacterHyperStat, ICharacterItemEquipment, ICharacterLinkSkill, ICharacterOtherStat, ICharacterPetEquipment, ICharacterPropensity, ICharacterSetEffect, ICharacterSkill, ICharacterStat, ICharacterSymbolEquipment, ICharacterVMatrix, IRingExchangeSkillEquipment, } from "@/interface/character/ICharacter";
import { ICharacterResponse } from "@/interface/character/ICharacterResponse";
import { ICharacterSummary } from "@/interface/character/ICharacterSummary";

const limitRunner = createRequestRunner({ concurrency: 5 });
const callCharacterApiBase = createApiCaller({ basePath: "character", runner: limitRunner });
const callGeneralApiBase = createApiCaller({ runner: limitRunner });

const callCharacterApi = <T>(
    endpoint: string,
    params: ApiParams = {},
): Promise<ICharacterResponse<T>> =>
    callCharacterApiBase<ICharacterResponse<T>>(endpoint, params);

const callApi = <T>(endpoint: string, params: ApiParams = {}): Promise<ICharacterResponse<T>> =>
    callGeneralApiBase<ICharacterResponse<T>>(endpoint, params);

export const findCharacterList = () =>
    callCharacterApi<{ characters: ICharacterSummary[] }>("list");

/* ---------------- 기본 API ---------------- */
export const findCharacterBasic = (ocid: string, date?: string) =>
    callCharacterApi<ICharacterBasic>("basic", { ocid, date });

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
