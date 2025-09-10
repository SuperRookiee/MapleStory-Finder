import axios from "axios";
import { useApiKeyStore } from "@/store/apiKeyStore";

export const findCharacterList = async () => {
    const apiKey = useApiKeyStore.getState().apiKey;
    const response = await axios.get(`/api/character/list`, {
        headers: { "x-nxopen-api-key": apiKey ?? "" },
    });
    return response.data;
};

const callCharacterApi = async (
    endpoint: string,
    params: Record<string, string>
) => {
    const apiKey = useApiKeyStore.getState().apiKey;
    const response = await axios.get(`/api/character/${endpoint}`, {
        headers: { "x-nxopen-api-key": apiKey ?? "" },
        params,
    });
    return response.data;
};

export const findCharacterBasic = (ocid: string) =>
    callCharacterApi("basic", { ocid });
export const findCharacterPopularity = (ocid: string) =>
    callCharacterApi("popularity", { ocid });
export const findCharacterStat = (ocid: string) =>
    callCharacterApi("stat", { ocid });
export const findCharacterHyperStat = (ocid: string) =>
    callCharacterApi("hyper-stat", { ocid });
export const findCharacterPropensity = (ocid: string) =>
    callCharacterApi("propensity", { ocid });
export const findCharacterAbility = (ocid: string) =>
    callCharacterApi("ability", { ocid });
export const findCharacterItemEquipment = (ocid: string) =>
    callCharacterApi("item-equipment", { ocid });
export const findCharacterCashItemEquipment = (ocid: string) =>
    callCharacterApi("cashitem-equipment", { ocid });
export const findCharacterSymbolEquipment = (ocid: string) =>
    callCharacterApi("symbol-equipment", { ocid });
export const findCharacterSetEffect = (ocid: string) =>
    callCharacterApi("set-effect", { ocid });
export const findCharacterBeautyEquipment = (ocid: string) =>
    callCharacterApi("beauty-equipment", { ocid });
export const findCharacterAndroidEquipment = (ocid: string) =>
    callCharacterApi("android-equipment", { ocid });
export const findCharacterPetEquipment = (ocid: string) =>
    callCharacterApi("pet-equipment", { ocid });
export const findCharacterSkill = (ocid: string) =>
    callCharacterApi("skill", { ocid });
export const findCharacterLinkSkill = (ocid: string) =>
    callCharacterApi("link-skill", { ocid });
export const findCharacterVMatrix = (ocid: string) =>
    callCharacterApi("vmatrix", { ocid });
export const findCharacterHexaMatrix = (ocid: string) =>
    callCharacterApi("hexamatrix", { ocid });
export const findCharacterHexaMatrixStat = (ocid: string) =>
    callCharacterApi("hexamatrix-stat", { ocid });
export const findCharacterDojang = (ocid: string) =>
    callCharacterApi("dojang", { ocid });
export const findCharacterOtherStat = (ocid: string) =>
    callCharacterApi("other-stat", { ocid });
export const findCharacterRingExchange = (ocid: string) =>
    callCharacterApi("ring-exchange-skill-equipment", { ocid });
export const findCharacterId = (character_name: string) =>
    callCharacterApi("id", { character_name });
