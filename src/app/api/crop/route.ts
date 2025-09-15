import sharp from "sharp";
import { Get } from "@/utils/fetch";
import { Failed } from "@/utils/message";

export const GET = Get(async (query: { url?: string }) => {
    if (!query.url) return Failed("url is required");

    const response = await fetch(query.url);
    const buffer = Buffer.from(await response.arrayBuffer());
    const cropped = await sharp(buffer).trim().png().toBuffer();
    const uint8 = new Uint8Array(cropped); // Buffer → Uint8Array 변환 (Response에서 안전하게 사용 가능)

    return new Response(uint8, {
        headers: {
            "Content-Type": "image/png",
            "Access-Control-Allow-Origin": "*",
        },
    });
});

export const OPTIONS = async () =>
    new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        },
    });
