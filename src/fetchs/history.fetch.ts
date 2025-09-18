import { createApiCaller, createRequestRunner, type ApiParams } from "@/fetchs/apiClient";
import { CubeHistoryData, PotentialHistoryData, StarforceHistoryData } from "@/interface/history/IHistory";
import { IHistoryResponse } from "@/interface/history/IHistoryResponse";

const historyRunner = createRequestRunner({ concurrency: 2 });
const callHistoryApiBase = createApiCaller({ basePath: "history", runner: historyRunner });

type HistoryEndpoint = "starforce" | "potential" | "cube";

const callHistoryApi = <T>(
    endpoint: HistoryEndpoint,
    params: ApiParams = {},
): Promise<IHistoryResponse<T>> => callHistoryApiBase<IHistoryResponse<T>>(endpoint, params);

export const findStarforceHistory = (params: ApiParams = {}) =>
    callHistoryApi<StarforceHistoryData>("starforce", params);

export const findPotentialHistory = (params: ApiParams = {}) =>
    callHistoryApi<PotentialHistoryData>("potential", params);

export const findCubeHistory = (params: ApiParams = {}) =>
    callHistoryApi<CubeHistoryData>("cube", params);
