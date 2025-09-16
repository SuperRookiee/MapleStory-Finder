import { GoogleGenerativeAI } from "@google/generative-ai";
import type { FigureGenerationMetadata, FigureRequestPayload, FigureResult } from "@/types/figure";
import { Post } from "@/utils/fetch";
import { Failed, Success } from "@/utils/message";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_PROMPT =
    process.env.GEMINI_DEFAULT_PROMPT?.trim() ??
    "Produce a collectible MapleStory-style figurine photo of the provided character image. Preserve the outfit, hair, and weapon exactly, pose the figure heroically, and render in a studio-quality product shot with a clean background.";

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

export const POST = Post<FigureRequestPayload>(async ({ imageUrl, prompt, characterName }) => {
    if (!isNonEmptyString(imageUrl)) {
        return Failed("캐릭터 이미지 URL이 필요합니다.", 400);
    }

    const apiKey = process.env.GEMINI_API_KEY;
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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let result;
    try {
        const response = await model.generateContent([
            { text: requestPrompt },
            { inlineData: { mimeType: encoded.mimeType, data: encoded.base64 } },
        ]);

        const candidate = response.response?.candidates?.[0];
        if (!candidate) {
            return Failed("Gemini 응답에서 결과를 찾을 수 없습니다.", 502);
        }

        const part = candidate.content.parts.find((p) => p.inlineData);
        if (!part || !part.inlineData) {
            return Failed("Gemini 응답에서 이미지 데이터를 찾을 수 없습니다.", 502);
        }

        result = {
            type: "base64",
            data: part.inlineData.data.replace(/\s+/g, ""),
            mimeType: part.inlineData.mimeType ?? "image/png",
        } as FigureResult;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Gemini API 호출 중 문제가 발생했습니다.";
        return Failed(message, 502);
    }

    const metadata: FigureGenerationMetadata = {
        provider: "gemini",
        prompt: requestPrompt,
        latencyMs: 0, // Gemini SDK에서 latency 정보는 직접 계산해야 합니다.
    };

    return Success("피규어 이미지 생성 성공", 200, {
        result,
        metadata,
    });
});