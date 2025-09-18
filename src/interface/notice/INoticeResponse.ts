import { SuccessType } from "@/types/MessageType";

export type INoticeResponse<T> = SuccessType & {
    data: T;
};
