import { SuccessType } from "@/types/MessageType";

export interface IRankingPayload<T> {
    ranking: T[];
}

export type IRankingResponse<T> = SuccessType & {
    data: IRankingPayload<T>;
};
