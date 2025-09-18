import { NextRequest } from "next/server";
import axios, { AxiosError } from "axios";
import { GetWithParams } from "@/utils/fetch";
import { Failed, Success } from "@/utils/message";

export const GET = async (
    req: NextRequest,
    context: { params: Promise<{ endpoint: string }> }
) => {
    const apiKey =
        req.headers.get("x-nxopen-api-key") || process.env.NEXT_PUBLIC_NEXON_API_KEY;

    const handler = GetWithParams<
        { endpoint: string } & Record<string, string>
    >(async (params) => {
        if (!apiKey) return Failed("Missing API Key", 500);

        const { endpoint, ...query } = params;

        const rankingEndpointMap: Record<string, string> = {
            overall: "overall",
            union: "union",
            dojang: "dojang",
            theseed: "theseed",
            achievement: "achievement",
            guild: "guild",
        };

        const resolvedEndpoint = rankingEndpointMap[endpoint];
        if (!resolvedEndpoint) {
            return Failed("Unsupported ranking endpoint", 400);
        }

        try {
            const res = await axios.get(
                `https://open.api.nexon.com/maplestory/v1/ranking/${resolvedEndpoint}`,
                {
                    params: query,
                    headers: { "x-nxopen-api-key": apiKey },
                }
            );
            return Success("랭킹 정보 조회 성공", 200, { data: res.data });
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                const message =
                    err.response?.data?.error?.message ?? err.message;
                const status = err.response?.status ?? 500;
                return Failed(message, status);
            }
            if (err instanceof Error) return Failed(err.message, 500);
            return Failed("Unknown error", 500);
        }
    });

    return handler(req, context);
};
