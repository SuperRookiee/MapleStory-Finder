import axios, { AxiosError } from "axios";
import type { FigureRequestPayload, FigureSuccessResponse } from "@/types/figure";
import type { ErrorType } from "@/types/MessageType";
import { unwrapOrThrow } from "@/utils/message";

export const requestCharacterFigure = async (
    payload: FigureRequestPayload,
): Promise<FigureSuccessResponse> => {
    try {
        const response = await axios.post<FigureSuccessResponse | ErrorType>("/api/figure", payload);
        return unwrapOrThrow<FigureSuccessResponse>(response.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            const message =
                error.response?.data?.error?.message ??
                error.message ??
                "피규어 이미지를 생성하는 중 오류가 발생했습니다.";
            throw new Error(message);
        }
        throw error;
    }
};
