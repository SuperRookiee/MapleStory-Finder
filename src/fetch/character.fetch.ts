import axios from "axios";
import { useApiKeyStore } from "@/store/apiKeyStore";

export const findCharacterList = async () => {
    const apiKey = useApiKeyStore.getState().apiKey;
    const response = await axios.get(`/api/character/list`, {
        headers: { "x-nxopen-api-key": apiKey ?? "" },
    });
    return response.data;
};