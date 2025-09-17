import { createApiCaller, createRequestRunner, type ApiParams } from "@/fetchs/apiClient";
import { IUnion, IUnionRaider, IUnionArtifact, IUnionChampion } from "@/interface/union/IUnion";
import { IUnionResponse } from "@/interface/union/IUnionResponse";

const queueRunner = createRequestRunner({ delayMs: 200 });
const callUnionApiBase = createApiCaller({ basePath: "union", runner: queueRunner });

const callUnionApi = <T>(
    endpoint: string,
    params: ApiParams = {},
): Promise<IUnionResponse<T>> =>
    callUnionApiBase<IUnionResponse<T>>(endpoint, params);

export const findUnion = (ocid: string, date?: string) =>
    callUnionApi<IUnion>("union", { ocid, date });

export const findUnionRaider = (ocid: string, date?: string) =>
    callUnionApi<IUnionRaider>("union-raider", { ocid, date });

export const findUnionArtifact = (ocid: string, date?: string) =>
    callUnionApi<IUnionArtifact>("union-artifact", { ocid, date });

export const findUnionChampion = (ocid: string, date?: string) =>
    callUnionApi<IUnionChampion>("union-champion", { ocid, date });
