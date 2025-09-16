import { Post } from "@/utils/fetch";
import { Failed, Success } from "@/utils/message";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type ChatHistoryMessage = {
    role: "user" | "assistant";
    content: string;
};

type ChatRequestBody = {
    message: string;
    history?: ChatHistoryMessage[];
    context?: string | null;
};

type GeminiContent = {
    role: "user" | "model";
    parts: { text: string }[];
};

type GeminiCandidate = {
    content?: {
        parts?: { text?: string }[];
    };
    finishReason?: string;
};

type GeminiResponse = {
    candidates?: GeminiCandidate[];
    promptFeedback?: {
        blockReason?: string;
    };
};

const buildEndpoint = (model: string) => {
    const base = process.env.GEMINI_API_BASE_URL ?? "https://generativelanguage.googleapis.com/v1beta";
    const normalizedBase = base.replace(/\/$/, "");
    const normalizedModel = model.replace(/^models\//, "");
    return `${normalizedBase}/models/${normalizedModel}:generateContent`;
};

const formatGeminiError = (error: unknown, status: number) => {
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

export const POST = Post<ChatRequestBody>(async ({ message, history = [], context }) => {
    const trimmedMessage = message?.trim();
    if (!trimmedMessage) {
        return Failed("질문을 입력해주세요.", 400);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return Failed("Gemini API Key가 설정되어 있지 않습니다.", 500);
    }

    const model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash-latest";

    const sanitizedHistory: GeminiContent[] = history
        .filter((entry): entry is ChatHistoryMessage =>
            Boolean(entry && typeof entry.content === "string" && (entry.role === "user" || entry.role === "assistant"))
        )
        .slice(-10)
        .map((entry) => {
            const text = entry.content.trim();
            if (!text) {
                return null;
            }
            return {
                role: entry.role === "assistant" ? "model" : "user",
                parts: [{ text }],
            } satisfies GeminiContent;
        })
        .filter((entry): entry is GeminiContent => entry !== null);

    const trimmedContext = context?.trim();
    const contextBlock = trimmedContext
        ? `다음은 사용자의 질문과 관련된 메이플스토리 데이터입니다. 이 정보를 우선적으로 참고하세요.\n\n${trimmedContext}`
        : null;

    const userPrompt = contextBlock ? `${contextBlock}\n\n질문: ${trimmedMessage}` : trimmedMessage;

    const contents: GeminiContent[] = [
        ...sanitizedHistory,
        {
            role: "user",
            parts: [{ text: userPrompt }],
        },
    ];

    const endpoint = new URL(buildEndpoint(model));
    endpoint.searchParams.set("key", apiKey);

    const response = await fetch(endpoint.toString(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            system_instruction: {
                role: "system",
                parts: [
                    {
                        text:
                            "당신은 MapleStory Finder의 AI 어시스턴트입니다. 최신 메이플스토리 데이터를 기반으로 정중하게 한국어로 답변하고, 제공된 정보가 불완전할 경우 그 사실을 명확히 밝히세요.",
                    },
                ],
            },
            contents,
            generationConfig: {
                temperature: 0.2,
            },
        }),
    });

    let parsedBody: unknown = null;
    try {
        parsedBody = await response.json();
    } catch {
        parsedBody = null;
    }

    if (!response.ok) {
        const errorMessage = formatGeminiError(parsedBody, response.status);
        return Failed(errorMessage, response.status);
    }

    if (!parsedBody || typeof parsedBody !== "object") {
        return Failed("Gemini 응답이 올바르지 않습니다.", 500);
    }

    const data = parsedBody as GeminiResponse;

    const blockReason = data.promptFeedback?.blockReason;
    if (blockReason && blockReason !== "BLOCK_REASON_UNSPECIFIED") {
        return Failed(`Gemini가 안전성 문제로 응답을 생성하지 않았습니다. (사유: ${blockReason})`, 400);
    }

    const candidate = data.candidates?.[0];
    if (!candidate) {
        return Failed("Gemini 응답이 비어 있습니다.", 500);
    }

    if (candidate.finishReason && !["STOP", "FINISH_REASON_UNSPECIFIED"].includes(candidate.finishReason)) {
        const reason = candidate.finishReason === "SAFETY" ? "안전성" : candidate.finishReason;
        return Failed(`Gemini 응답이 완료되지 않았습니다. (사유: ${reason})`, 400);
    }

    const replyParts = candidate.content?.parts
        ?.map((part) => (typeof part.text === "string" ? part.text.trim() : ""))
        .filter((text) => text.length > 0);

    const reply = replyParts?.length ? replyParts.join("\n\n") : null;

    if (!reply) {
        return Failed("Gemini 응답이 비어 있습니다.", 500);
    }

    return Success("AI 응답 생성 성공", 200, { reply });
});
