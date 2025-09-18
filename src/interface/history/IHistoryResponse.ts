import { SuccessType } from "@/types/MessageType";

export type IHistoryResponse<T> = SuccessType & {
    data: T;
};
