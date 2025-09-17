import axios, { AxiosError } from "axios";
import { userStore } from "@/stores/userStore";
import { IUnion, IUnionRaider, IUnionArtifact, IUnionChampion } from "@/interface/union/IUnion";
import { IUnionResponse } from "@/interface/union/IUnionResponse";

const getApiKeyInfo = () => {
    const { apiKey, isGuest } = userStore.getState().user;
    const fallback = process.env.NEXT_PUBLIC_NEXON_API_KEY ?? "";
    return {
        key: apiKey ?? fallback,
        isGuest: Boolean(isGuest),
    };
};

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

let requestQueue: Promise<unknown> = Promise.resolve();

const callUnionApi = async <T>(
    endpoint: string,
    params: Record<string, string | number | undefined> = {}
): Promise<IUnionResponse<T>> => {
    const { key, isGuest } = getApiKeyInfo();

    const task = async () => {
        await delay(200);
        try {
            const response = await axios.get<IUnionResponse<T>>(`/api/union/${endpoint}`, {
                headers: { "x-nxopen-api-key": key },
                params: Object.fromEntries(
                    Object.entries(params).filter(([, v]) => v !== undefined)
                ),
            });
            return response.data;
        } catch (err) {
            if (
                err instanceof AxiosError &&
                err.response?.data?.error?.message === "Missing API Key"
            ) {
                if (!isGuest && typeof window !== "undefined") {
                    window.location.href = "/my_page?missingApiKey=1";
                }
            }
            throw err;
        }
    };

    const result = requestQueue.then(task);
    requestQueue = result.catch(() => undefined);
    return result;
};

export const findUnion = (ocid: string, date?: string) =>
    callUnionApi<IUnion>("union", { ocid, date });

export const findUnionRaider = (ocid: string, date?: string) =>
    callUnionApi<IUnionRaider>("union-raider", { ocid, date });

export const findUnionArtifact = (ocid: string, date?: string) =>
    callUnionApi<IUnionArtifact>("union-artifact", { ocid, date });

export const findUnionChampion = (ocid: string, date?: string) =>
    callUnionApi<IUnionChampion>("union-champion", { ocid, date });
