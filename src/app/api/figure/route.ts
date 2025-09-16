import type { FigureGenerationMetadata, FigureRequestPayload, FigureResult } from "@/types/figure";
import { Post } from "@/utils/fetch";
import { Failed, Success } from "@/utils/message";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_PROMPT =
    process.env.BANANA_DEFAULT_PROMPT?.trim() ??
    "Produce a collectible MapleStory-style figurine photo of the provided character image. Preserve the outfit, hair, and weapon exactly, pose the figure heroically, and render in a studio-quality product shot with a clean background.";

const isNonEmptyString = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;

const looksLikeUrl = (value: string) => /^https?:\/\//i.test(value);
const looksLikeDataUrl = (value: string) => value.startsWith("data:");
const looksLikeBase64 = (value: string) => {
    if (value.length < 60) return false;
    const normalized = value.replace(/\s+/g, "");
    return /^[A-Za-z0-9+/=]+$/.test(normalized);
};

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

type QueueEntry = { value: unknown; keyHint?: string };

const imageKeyFragments = ["image", "img", "base64", "b64", "url", "uri"];
const skipKeyFragments = ["input", "request", "source"];

const extractImageFromPayload = (
    payload: unknown,
    skipValues: Set<string>,
): FigureResult | null => {
    if (!payload || typeof payload !== "object") return null;

    const visited = new Set<object>();
    const queue: QueueEntry[] = [{ value: payload }];

    while (queue.length) {
        const entry = queue.shift();
        if (!entry) break;
        const { value, keyHint } = entry;

        if (Array.isArray(value)) {
            for (const item of value) {
                if (typeof item === "string") {
                    if (!keyHint) continue;
                    if (!imageKeyFragments.some((fragment) => keyHint.toLowerCase().includes(fragment))) continue;
                    const candidate = item.trim();
                    if (!candidate || skipValues.has(candidate)) continue;
                    if (looksLikeUrl(candidate) || looksLikeDataUrl(candidate)) {
                        return { type: "url", data: candidate };
                    }
                    if (looksLikeBase64(candidate)) {
                        return { type: "base64", data: candidate.replace(/\s+/g, "") };
                    }
                } else if (item && typeof item === "object") {
                    queue.push({ value: item, keyHint });
                }
            }
            continue;
        }

        if (!value || typeof value !== "object") continue;
        if (visited.has(value)) continue;
        visited.add(value);

        const entries = Object.entries(value as Record<string, unknown>);
        for (const [key, child] of entries) {
            const lowerKey = key.toLowerCase();

            if (typeof child === "string") {
                const candidate = child.trim();
                if (!candidate || skipValues.has(candidate)) continue;

                const shouldInspect =
                    imageKeyFragments.some((fragment) => lowerKey.includes(fragment)) &&
                    !skipKeyFragments.some((fragment) => lowerKey.includes(fragment));

                if (!shouldInspect) continue;

                if (looksLikeUrl(candidate) || looksLikeDataUrl(candidate)) {
                    return { type: "url", data: candidate };
                }

                if (looksLikeBase64(candidate)) {
                    const mimeEntry = entries.find(([siblingKey, siblingValue]) =>
                        typeof siblingValue === "string" && siblingKey.toLowerCase().includes("mime"),
                    );

                    const result: FigureResult = {
                        type: "base64",
                        data: candidate.replace(/\s+/g, ""),
                    };

                    if (mimeEntry) {
                        result.mimeType = (mimeEntry[1] as string).trim();
                    }

                    return result;
                }
            } else if (child && typeof child === "object") {
                queue.push({ value: child, keyHint: lowerKey });
            }
        }
    }

    return null;
};

const findFirstStringByKeys = (payload: unknown, keys: string[]): string | undefined => {
    if (!payload || typeof payload !== "object") return undefined;

    const normalized = keys.map((key) => key.toLowerCase());
    const visited = new Set<object>();
    const queue: QueueEntry[] = [{ value: payload }];

    while (queue.length) {
        const entry = queue.shift();
        if (!entry) break;
        const { value } = entry;

        if (Array.isArray(value)) {
            for (const item of value) {
                if (item && typeof item === "object") {
                    queue.push({ value: item });
                }
            }
            continue;
        }

        if (!value || typeof value !== "object") continue;
        if (visited.has(value)) continue;
        visited.add(value);

        for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
            const lowerKey = key.toLowerCase();
            if (normalized.includes(lowerKey) && typeof child === "string" && child.trim().length > 0) {
                return child.trim();
            }
            if (child && typeof child === "object") {
                queue.push({ value: child });
            }
        }
    }

    return undefined;
};

const parseErrorMessage = (body: unknown, fallback: string) => {
    if (!body || typeof body !== "object") return fallback;

    const candidates: unknown[] = [];
    const objectBody = body as Record<string, unknown>;

    if (typeof objectBody.error === "string") {
        candidates.push(objectBody.error);
    } else if (objectBody.error && typeof objectBody.error === "object") {
        const nested = objectBody.error as Record<string, unknown>;
        if (typeof nested.message === "string") candidates.push(nested.message);
        if (typeof nested.detail === "string") candidates.push(nested.detail);
    }

    if (typeof objectBody.message === "string") candidates.push(objectBody.message);
    if (typeof objectBody.detail === "string") candidates.push(objectBody.detail);

    const found = candidates.find(isNonEmptyString);
    return found ?? fallback;
};

export const POST = Post<FigureRequestPayload>(async ({ imageUrl, prompt, characterName }) => {
    if (!isNonEmptyString(imageUrl)) {
        return Failed("캐릭터 이미지 URL이 필요합니다.", 400);
    }

    const bananaUrl = process.env.BANANA_MODEL_URL ?? process.env.BANANA_API_URL;
    if (!bananaUrl) {
        return Failed("Banana API URL이 설정되어 있지 않습니다.", 500);
    }

    const apiKey = process.env.BANANA_API_KEY;
    if (!apiKey) {
        return Failed("Banana API Key가 설정되어 있지 않습니다.", 500);
    }

    const modelKey = process.env.BANANA_MODEL_KEY?.trim();

    let encoded;
    try {
        encoded = await fetchImageAsBase64(imageUrl);
    } catch (error) {
        const message = error instanceof Error ? error.message : "캐릭터 이미지를 불러오는 중 문제가 발생했습니다.";
        return Failed(message, 502);
    }

    const requestPrompt = createPrompt(prompt, characterName);

    const requestPayload = {
        ...(modelKey ? { modelKey } : {}),
        prompt: requestPrompt,
        imageUrl,
        image_base64: encoded.base64,
        imageMimeType: encoded.mimeType,
        modelInputs: {
            prompt: requestPrompt,
            image_url: imageUrl,
            image_base64: encoded.base64,
            mime_type: encoded.mimeType,
        },
        input: {
            prompt: requestPrompt,
            image_url: imageUrl,
            image_base64: encoded.base64,
            mime_type: encoded.mimeType,
        },
    };

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-BANANA-API-KEY": apiKey,
        "X-Requested-With": "MapleStoryFinder",
    };

    if (process.env.BANANA_SEND_AUTHORIZATION !== "false") {
        headers.Authorization = `Bearer ${apiKey}`;
    }

    const startedAt = Date.now();
    const response = await fetch(bananaUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(requestPayload),
    });

    const rawText = await response.text();
    let parsedBody: unknown = null;
    if (rawText) {
        try {
            parsedBody = JSON.parse(rawText);
        } catch {
            parsedBody = rawText;
        }
    }

    if (!response.ok) {
        const fallback = `Banana API 요청에 실패했습니다. (status: ${response.status})`;
        const message = typeof parsedBody === "object" && parsedBody !== null
            ? parseErrorMessage(parsedBody, fallback)
            : fallback;

        return Failed(message, response.status);
    }

    if (!parsedBody || typeof parsedBody !== "object") {
        return Failed("Banana API 응답 형식이 올바르지 않습니다.", 502);
    }

    const skipValues = new Set<string>([
        imageUrl.trim(),
        encoded.base64,
        `data:${encoded.mimeType};base64,${encoded.base64}`,
    ]);

    const figure = extractImageFromPayload(parsedBody, skipValues);
    if (!figure) {
        return Failed("Banana API 응답에서 생성된 이미지를 찾을 수 없습니다.", 502);
    }

    const metadata: FigureGenerationMetadata = {
        provider: "banana-gemini-nano",
        prompt: requestPrompt,
        latencyMs: Date.now() - startedAt,
    };

    const callId = findFirstStringByKeys(parsedBody, ["callid", "call_id", "run_id", "prediction_id"]);
    if (callId) {
        metadata.callId = callId;
    }

    if (!figure.mimeType) {
        const mimeFromResponse = findFirstStringByKeys(parsedBody, ["mime_type", "content_type", "mimetype", "media_type"]);
        if (mimeFromResponse) {
            figure.mimeType = mimeFromResponse;
        }
    }

    if (figure.type === "base64") {
        figure.data = figure.data.replace(/\s+/g, "");
        if (!figure.mimeType) {
            figure.mimeType = "image/png";
        }
    }

    return Success("피규어 이미지 생성 성공", 200, {
        result: figure,
        metadata,
    });
});
