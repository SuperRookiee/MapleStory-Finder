import { createApiCaller, createRequestRunner, type ApiParams } from "@/fetchs/apiClient";
import { IGuildBasic, IGuildId } from "@/interface/guild/IGuild";
import { IGuildResponse } from "@/interface/guild/IGuildResponse";

const queueRunner = createRequestRunner({ delayMs: 200 });
const callGuildApiBase = createApiCaller({ basePath: "guild", runner: queueRunner });

const callGuildApi = <T>(
    endpoint: string,
    params: ApiParams = {},
): Promise<IGuildResponse<T>> =>
    callGuildApiBase<IGuildResponse<T>>(endpoint, params);

export const findGuildId = (guild_name: string, world_name: string) =>
    callGuildApi<IGuildId>("id", { guild_name, world_name });

export const findGuildBasic = (oguild_id: string, date?: string) =>
    callGuildApi<IGuildBasic>("basic", { oguild_id, date });
