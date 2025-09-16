import type { SuccessType } from "@/types/MessageType";

export interface FigureRequestPayload {
    imageUrl: string;
    /** Optional custom prompt passed to the Gemini image generator */
    prompt?: string;
    /** Character name used for the default prompt if none is supplied */
    characterName?: string;
}

export type FigureResultType = "base64" | "url";

export interface FigureResult {
    type: FigureResultType;
    data: string;
    mimeType?: string;
}

export interface FigureGenerationMetadata {
    provider?: string;
    prompt?: string;
    callId?: string;
    latencyMs?: number;
    model?: string;
}

export interface FigureSuccessResponse extends SuccessType {
    result: FigureResult;
    metadata?: FigureGenerationMetadata;
}
