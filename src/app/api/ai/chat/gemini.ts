import type { ChatHistoryMessage } from "@/types/ai/chat";

const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_SYSTEM_PROMPT =
    "당신은 MapleStory Finder의 AI 어시스턴트입니다. 최신 메이플스토리 데이터를 기반으로 정중하게 한국어로 답하고, 제공된 정보가 불완전할 경우 그 사실을 명확히 밝히세요.";

export type GeminiRole = "user" | "model";

export interface GeminiContent {
    role: GeminiRole;
    parts: { text: string }[];
}

export interface GeminiCandidate {
    content?: {
        parts?: { text?: string }[];
    };
    finishReason?: string;
}

export interface GeminiResponse {
    candidates?: GeminiCandidate[];
    promptFeedback?: {
        blockReason?: string;
    };
}

export interface GeminiRequestPayload {
    system_instruction: {
        role: "system";
        parts: { text: string }[];
    };
    contents: GeminiContent[];
    generationConfig: {
        temperature: number;
    };
}

export const buildGeminiEndpoint = (model: string, baseUrl?: string) => {
    const base = (baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    const normalizedModel = model.replace(/^models\//, "");
    return `${base}/models/${normalizedModel}:generateContent`;
};

export const sanitizeHistory = (history: ChatHistoryMessage[]): GeminiContent[] => {
    return history
        .filter((entry) =>
            Boolean(entry && typeof entry.content === "string" && entry.content.trim().length > 0),
        )
        .slice(-10)
        .map((entry) => ({
            role: entry.role === "assistant" ? "model" : "user",
            parts: [{ text: entry.content.trim() }],
        }));
};

export const createUserPrompt = (message: string, context?: string | null) => {
    const trimmedMessage = message.trim();
    const trimmedContext = context?.trim();
    if (!trimmedContext) {
        return trimmedMessage;
    }
    return `다음은 사용자의 질문과 관련된 메이플스토리 데이터입니다. 이 정보를 우선적으로 참고하세요.\n\n${trimmedContext}\n\n질문: ${trimmedMessage}`;
};

export const createGeminiRequestPayload = (
    history: ChatHistoryMessage[],
    message: string,
    context?: string | null,
): GeminiRequestPayload => {
    const contents: GeminiContent[] = [
        ...sanitizeHistory(history),
        {
            role: "user",
            parts: [{ text: createUserPrompt(message, context) }],
        },
    ];

    return {
        system_instruction: {
            role: "system",
            parts: [
                {
                    text: DEFAULT_SYSTEM_PROMPT,
                },
            ],
        },
        contents,
        generationConfig: {
            temperature: 0.2,
        },
    };
};

export const formatGeminiError = (error: unknown, status: number) => {
    const fallback = `Gemini API 요청에 실패했습니다. (status: ${status})`;
    if (typeof error === "string" && error.trim().length > 0) {
        return error;
    }
    if (error && typeof error === "object") {
        const maybeError = (error as { error?: { message?: string }; message?: string }).error?.message;
        if (maybeError && maybeError.trim().length > 0) {
            return maybeError;
        }
        const message = (error as { message?: string }).message;
        if (message && message.trim().length > 0) {
            return message;
        }
    }
    return fallback;
};

export const extractReplyText = (candidate: GeminiCandidate) => {
    const replyParts = candidate.content?.parts
        ?.map((part) => (typeof part.text === "string" ? part.text.trim() : ""))
        .filter((text) => text.length > 0);

    return replyParts?.length ? replyParts.join("\n\n") : null;
};
