import { createApiCaller, createRequestRunner, type ApiParams } from "@/fetchs/apiClient";
import { IAchievementRanking, IDojangRanking, IOverallRanking, ITheSeedRanking, IUnionRanking, } from "@/interface/ranking/IRanking";
import { IRankingResponse } from "@/interface/ranking/IRankingResponse";

const rankingRunner = createRequestRunner({ concurrency: 5 });
const callRankingApiBase = createApiCaller({ basePath: "ranking", runner: rankingRunner });

type RankingEndpoint =
    | "overall"
    | "union"
    | "dojang"
    | "theseed"
    | "achievement"
    | "guild";

const callRankingApi = <T>(
    endpoint: RankingEndpoint,
    params: ApiParams = {},
): Promise<IRankingResponse<T>> =>
    callRankingApiBase<IRankingResponse<T>>(endpoint, params);

export const findOverallRanking = (ocid: string, options: ApiParams = {}) =>
    callRankingApi<IOverallRanking>("overall", { ocid, ...options });

export const findUnionRanking = (ocid: string, options: ApiParams = {}) =>
    callRankingApi<IUnionRanking>("union", { ocid, ...options });

export const findDojangRanking = (
    ocid: string,
    options: ApiParams = {},
) => callRankingApi<IDojangRanking>("dojang", { ocid, ...options });

export const findTheSeedRanking = (ocid: string, options: ApiParams = {}) =>
    callRankingApi<ITheSeedRanking>("theseed", { ocid, ...options });

export const findAchievementRanking = (ocid: string, options: ApiParams = {}) =>
    callRankingApi<IAchievementRanking>("achievement", { ocid, ...options });
