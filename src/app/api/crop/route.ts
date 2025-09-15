import { Get } from "@/utils/fetch";
import { Failed } from "@/utils/message";
import { trimImage } from "@/utils/trim";

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

    let cropped: Buffer;
    try {
        cropped = trimImage(buffer);
    } catch {
        return Failed("failed to process image");
    }

    return new Response(cropped, {
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
