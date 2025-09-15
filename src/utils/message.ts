import { ErrorType, SuccessType, WithoutConflict } from "@/types/MessageType";

// #. 성공 메세지
export const Success = <T extends object = object>(message: string, status?: number, options?: WithoutConflict<T>): SuccessType & T => {
    return {
        message,
        ...(status !== undefined ? { status } : {}),
        ...(options ?? {}),
    } as SuccessType & T;
};

// #. 실패 메세지 (에러)
export const Failed = <T extends object = object>(message: string, status?: number, options?: WithoutConflict<T>): ErrorType & T => {
    return {
        error: { message },
        ...(status !== undefined ? { status } : {}),
        ...(options ?? {}),
    } as ErrorType & T;
};

// #. 오류 헬퍼
export const unwrapOrThrow = <T>(res: T | { error: { message: string } }): T => {
    if (typeof res === "object" && res !== null && "error" in res) {
        const msg = (res as { error: { message: string } }).error.message ?? "Unknown error";
        throw new Error(msg);
    }
    return res as T;
}


