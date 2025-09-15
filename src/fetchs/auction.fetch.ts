import axios, { AxiosError } from "axios";
import { IAuctionList } from "@/interface/auction/IAuction";
import { IAuctionResponse } from "@/interface/auction/IAuctionResponse";
import { userStore } from "@/stores/userStore";

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

let requestQueue: Promise<unknown> = Promise.resolve();

const callAuctionApi = async <T>(
    endpoint: string,
    params: Record<string, string | number | undefined> = {}
): Promise<IAuctionResponse<T>> => {
    const apiKey = userStore.getState().user.apiKey;

    const task = async () => {
        await delay(200);
        try {
            const response = await axios.get<IAuctionResponse<T>>(`/api/auction/${endpoint}`,
                {
                    headers: { "x-nxopen-api-key": apiKey ?? "" },
                    params: Object.fromEntries(
                        Object.entries(params).filter(([, v]) => v !== undefined)
                    ),
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

    const result = requestQueue.then(task);
    requestQueue = result.catch(() => undefined);
    return result;
};

export const findAuctionList = (item_name: string, page?: number) =>
    callAuctionApi<IAuctionList>("list", { item_name, page });
