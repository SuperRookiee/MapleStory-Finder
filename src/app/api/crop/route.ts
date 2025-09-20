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
    const contentType = response.headers.get("content-type") ?? "";

    let processedBuffer: Buffer | Uint8Array = buffer;
    let processedContentType = contentType || "application/octet-stream";

    if (contentType.includes("image/png")) {
        try {
            processedBuffer = Buffer.from(trimImage(buffer));
            processedContentType = "image/png";
        } catch {
            processedBuffer = buffer;
            processedContentType = contentType || "image/png";
        }
    }

    return new Response(Buffer.from(processedBuffer), {
        headers: {
            "Content-Type": processedContentType,
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
