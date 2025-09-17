import axios, { AxiosError } from "axios";
import pLimit from "p-limit";
import { userStore } from "@/stores/userStore";

export type ApiParams = Record<string, string | number | undefined>;

type RequestTask<T> = () => Promise<T>;

const filterUndefinedParams = (params: ApiParams) =>
    Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined),
    );

const redirectToMissingApiKey = (isGuest: boolean) => {
    if (!isGuest && typeof window !== "undefined") {
        window.location.href = "/my_page?missingApiKey=1";
    }
};

export const getApiKeyInfo = () => {
    const { apiKey, isGuest } = userStore.getState().user;
    const fallback = process.env.NEXT_PUBLIC_NEXON_API_KEY ?? "";
    return {
        key: apiKey ?? fallback,
        isGuest: Boolean(isGuest),
    };
};

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export type RequestRunner = <T>(task: RequestTask<T>) => Promise<T>;

type RequestRunnerOptions = {
    concurrency?: number;
    delayMs?: number;
};

export const createRequestRunner = ({
    concurrency,
    delayMs,
}: RequestRunnerOptions = {}): RequestRunner => {
    const limiter = typeof concurrency === "number" ? pLimit(concurrency) : null;
    let queue: Promise<unknown> = Promise.resolve();

    return <T>(task: RequestTask<T>) => {
        const execute = async () => {
            if (delayMs) {
                await delay(delayMs);
            }
            return task();
        };

        if (limiter) {
            return limiter(execute);
        }

        if (delayMs) {
            const result = queue.then(execute);
            queue = result.catch(() => undefined);
            return result;
        }

        return execute();
    };
};

const defaultRunner: RequestRunner = (task) => task();

type ApiCallerOptions = {
    basePath?: string;
    runner?: RequestRunner;
};

export const createApiCaller = ({
    basePath = "",
    runner = defaultRunner,
}: ApiCallerOptions = {}) =>
    async <TResponse>(endpoint: string, params: ApiParams = {}): Promise<TResponse> => {
        const { key, isGuest } = getApiKeyInfo();
        const url = basePath ? `/api/${basePath}/${endpoint}` : `/api/${endpoint}`;

        const runRequest = async () => {
            try {
                const response = await axios.get<TResponse>(url, {
                    headers: { "x-nxopen-api-key": key },
                    params: filterUndefinedParams(params),
                });
                return response.data;
            } catch (error) {
                if (
                    error instanceof AxiosError &&
                    error.response?.data?.error?.message === "Missing API Key"
                ) {
                    redirectToMissingApiKey(isGuest);
                }
                throw error;
            }
        };

        return runner(runRequest);
    };
