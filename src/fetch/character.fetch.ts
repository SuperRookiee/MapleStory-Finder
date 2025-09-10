import axios from "axios";
import { useApiKeyStore } from "@/store/apiKeyStore";

export const findCharacterList = async () => {
    const apiKey = useApiKeyStore.getState().apiKey;
    const response = await axios.get(`/api/character/list`, {
        headers: { "x-nxopen-api-key": apiKey ?? "" },
    });
    return response.data;
};
export const findCharacterBasic = async (ocid: string) => {
    const apiKey = useApiKeyStore.getState().apiKey;
    const response = await axios.get(`/api/character/basic?ocid=${ocid}`, {
        headers: { "x-nxopen-api-key": apiKey ?? "" },
    });
    return response.data;
};
