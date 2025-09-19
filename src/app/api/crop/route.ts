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

    const contentType = response.headers.get("content-type") ?? "image/png";
    const buffer = Buffer.from(await response.arrayBuffer());

    // Only attempt to crop when the image is PNG; otherwise return the original.
    if (contentType.includes("png")) {
        try {
            const cropped = trimImage(buffer);
            return new Response(Buffer.from(cropped), {
                headers: {
                    "Content-Type": "image/png",
                    "Access-Control-Allow-Origin": "*",
                    "Cache-Control": "no-store",
                },
            });
        } catch {
            // If trimming fails, fall back to the original image buffer.
        }
    }

    return new Response(buffer, {
        headers: {
            "Content-Type": contentType,
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
