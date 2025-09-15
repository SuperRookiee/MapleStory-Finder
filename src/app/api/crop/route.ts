import sharp from "sharp";
import { Get } from "@/utils/fetch";
import { Failed } from "@/utils/message";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = Get(async (query: { url?: string }) => {
    if (!query.url) return Failed("url is required");

    const response = await fetch(query.url, {
        cache: "no-store",
        headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!response.ok) return Failed("failed to fetch image");

    const buffer = Buffer.from(await response.arrayBuffer());
    const cropped = await sharp(buffer).trim().png().toBuffer();
    const uint8 = new Uint8Array(cropped);
    const blob = new Blob([uint8], { type: "image/png" });

    return new Response(blob, {
        headers: {
            "Content-Type": "image/png",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store",
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
