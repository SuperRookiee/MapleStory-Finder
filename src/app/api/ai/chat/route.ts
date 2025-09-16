import type { ChatRequestPayload } from "@/types/ai/chat";
import { Post } from "@/utils/fetch";
import { Failed, Success } from "@/utils/message";
import {
    buildGeminiEndpoint,
    createGeminiRequestPayload,
    extractReplyText,
    formatGeminiError,
    type GeminiResponse,
} from "./gemini";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const POST = Post<ChatRequestPayload>(async ({ message, history = [], context }) => {
    const trimmedMessage = message?.trim();
    if (!trimmedMessage) {
        return Failed("질문을 입력해주세요.", 400);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return Failed("Gemini API Key가 설정되어 있지 않습니다.", 500);
    }

    const model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash-latest";
    const endpoint = new URL(buildGeminiEndpoint(model, process.env.GEMINI_API_BASE_URL));
    endpoint.searchParams.set("key", apiKey);

    const historyMessages = Array.isArray(history) ? history : [];
    const payload = createGeminiRequestPayload(historyMessages, trimmedMessage, context);

    const response = await fetch(endpoint.toString(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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

    const reply = extractReplyText(candidate);

    if (!reply) {
        return Failed("Gemini 응답이 비어 있습니다.", 500);
    }

    return Success("AI 응답 생성 성공", 200, { reply });
});
