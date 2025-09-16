import { GoogleGenAI, Modality, type GenerateContentResponse } from "@google/genai";
import type { FigureGenerationMetadata, FigureRequestPayload, FigureResult } from "@/types/figure";
import { Post } from "@/utils/fetch";
import { Failed, Success } from "@/utils/message";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_PROMPT =
    process.env.GEMINI_DEFAULT_PROMPT?.trim() ??
    "Produce a collectible MapleStory-style figurine photo of the provided character image. Preserve the outfit, hair, and weapon exactly, pose the figure heroically, and render in a studio-quality product shot with a clean background.";

const FIGURE_MODEL = process.env.GEMINI_FIGURE_MODEL?.trim() ?? "gemini-2.5-flash-image-preview";

const isNonEmptyString = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;

const createPrompt = (prompt: string | undefined, characterName?: string) => {
    const trimmed = prompt?.trim();
    if (trimmed) return trimmed;
    if (characterName && characterName.trim().length > 0) {
        return `${DEFAULT_PROMPT}\n\nCharacter: ${characterName.trim()}. Reproduce the outfit colors and accessories accurately.`;
    }
    return DEFAULT_PROMPT;
};

const fetchImageAsBase64 = async (url: string) => {
    const response = await fetch(url, {
        cache: "no-store",
        headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) {
        throw new Error("캐릭터 이미지를 불러오는 데 실패했습니다.");
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const mimeType = response.headers.get("content-type") ?? "image/png";

    return { base64: buffer.toString("base64"), mimeType };
};

type InlineImage = {
    data: string;
    mimeType?: string;
};

const extractFirstInlineImage = (response: GenerateContentResponse): InlineImage | null => {
    const candidates = response.candidates ?? [];

    for (const candidate of candidates) {
        const parts = candidate.content?.parts ?? [];
        for (const part of parts) {
            const inline = part?.inlineData;
            if (inline?.data) {
                return {
                    data: inline.data,
                    mimeType: inline.mimeType ?? undefined,
                };
            }
        }
    }

    return null;
};

export const POST = Post<FigureRequestPayload>(async ({ imageUrl, prompt, characterName }) => {
    if (!isNonEmptyString(imageUrl)) {
        return Failed("캐릭터 이미지 URL이 필요합니다.", 400);
    }

    const apiKey = process.env.GOOGLE_API_KEY?.trim() ?? process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
        return Failed("Gemini API Key가 설정되어 있지 않습니다.", 500);
    }

    let encoded;
    try {
        encoded = await fetchImageAsBase64(imageUrl);
    } catch (error) {
        const message = error instanceof Error ? error.message : "캐릭터 이미지를 불러오는 중 문제가 발생했습니다.";
        return Failed(message, 502);
    }

    const requestPrompt = createPrompt(prompt, characterName);
    const ai = new GoogleGenAI({ apiKey });

    const startedAt = Date.now();

    let response: GenerateContentResponse;
    try {
        response = await ai.models.generateContent({
            model: FIGURE_MODEL,
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: requestPrompt },
                        {
                            inlineData: {
                                mimeType: encoded.mimeType,
                                data: encoded.base64,
                            },
                        },
                    ],
                },
            ],
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
    } catch (error) {
        const status = typeof (error as { status?: number }).status === "number" ? (error as { status?: number }).status : 502;
        const message = error instanceof Error ? error.message : "Gemini API 요청에 실패했습니다.";
        return Failed(message, status);
    }

    const inlineImage = extractFirstInlineImage(response);
    if (!inlineImage) {
        return Failed("Gemini API 응답에서 생성된 이미지를 찾을 수 없습니다.", 502);
    }

    const figure: FigureResult = {
        type: "base64",
        data: inlineImage.data.replace(/\s+/g, ""),
        mimeType: inlineImage.mimeType ?? "image/png",
    };

    const metadata: FigureGenerationMetadata = {
        provider: "Google Gemini API",
        prompt: requestPrompt,
        latencyMs: Date.now() - startedAt,
        model: FIGURE_MODEL,
    };

    if (response.responseId) {
        metadata.callId = response.responseId;
    }

    return Success("피규어 이미지 생성 성공", 200, {
        result: figure,
        metadata,
    });
});
