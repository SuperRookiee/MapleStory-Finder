import { createApiCaller, createRequestRunner, type ApiParams } from "@/fetchs/apiClient";
import { IUserAchievement } from "@/interface/user/IUserAchievement";
import { IUserCharacterList } from "@/interface/user/IUserCharacterList";
import { IUserLegacyOuid, IUserOuid } from "@/interface/user/IUserOuid";
import { IUserResponse } from "@/interface/user/IUserResponse";

const userRunner = createRequestRunner({ concurrency: 5 });
const callUserApiBase = createApiCaller({ basePath: "user", runner: userRunner });
const callLegacyUserApiBase = createApiCaller({ basePath: "user/legacy", runner: userRunner });

const callUserApi = <T>(endpoint: string, params: ApiParams = {}): Promise<IUserResponse<T>> =>
    callUserApiBase<IUserResponse<T>>(endpoint, params);

const callLegacyUserApi = <T>(endpoint: string, params: ApiParams = {}): Promise<IUserResponse<T>> =>
    callLegacyUserApiBase<IUserResponse<T>>(endpoint, params);

export const findUserCharacterList = () =>
    callUserApi<IUserCharacterList>("character/list");

export const findUserAchievement = (params: ApiParams = {}) =>
    callUserApi<IUserAchievement>("achievement", params);

export const findUserOuid = (params: ApiParams = {}) =>
    callUserApi<IUserOuid>("ouid", params);

export const findLegacyUserOuid = (params: ApiParams = {}) =>
    callLegacyUserApi<IUserLegacyOuid>("ouid", params);
