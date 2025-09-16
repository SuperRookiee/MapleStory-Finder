import type { SuccessType } from "@/types/MessageType";

export type ChatRole = "user" | "assistant";

export interface ChatHistoryMessage {
    role: ChatRole;
    content: string;
}

export interface ChatRequestPayload {
    message: string;
    history?: ChatHistoryMessage[];
    context?: string | null;
}

export interface ChatSuccessResponse extends SuccessType {
    reply: string;
}
