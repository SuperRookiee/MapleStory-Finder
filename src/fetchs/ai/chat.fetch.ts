import axios, { AxiosError } from "axios";
import type { ChatRequestPayload, ChatSuccessResponse } from "@/types/ai/chat";
import type { ErrorType } from "@/types/MessageType";
import { unwrapOrThrow } from "@/utils/message";

export const requestAiChat = async (payload: ChatRequestPayload): Promise<ChatSuccessResponse> => {
    try {
        const response = await axios.post<ChatSuccessResponse | ErrorType>("/api/ai/chat", payload);
        return unwrapOrThrow<ChatSuccessResponse>(response.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            const message =
                error.response?.data?.error?.message ??
                error.message ?? "AI 응답 생성에 실패했습니다.";
            throw new Error(message);
        }
        throw error;
    }
};
