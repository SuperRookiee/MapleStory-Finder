import axios, { AxiosError } from "axios";
import { IGuildBasic, IGuildId } from "@/interface/guild/IGuild";
import { IGuildResponse } from "@/interface/guild/IGuildResponse";
import { userStore } from "@/stores/userStore";

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

const callGuildApi = async <T>(
    endpoint: string,
    params: Record<string, string | number | undefined> = {}
): Promise<IGuildResponse<T>> => {
    const { key, isGuest } = getApiKeyInfo();

    const task = async () => {
        await delay(200);
        try {
            const response = await axios.get<IGuildResponse<T>>(
                `/api/guild/${endpoint}`,
                {
                    headers: { "x-nxopen-api-key": key },
                    params: Object.fromEntries(
                        Object.entries(params).filter(([, v]) => v !== undefined)
                    ),
                }
            );
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

export const findGuildId = (guild_name: string, world_name: string) =>
    callGuildApi<IGuildId>("id", { guild_name, world_name });

export const findGuildBasic = (oguild_id: string, date?: string) =>
    callGuildApi<IGuildBasic>("basic", { oguild_id, date });
