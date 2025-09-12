import axios, { AxiosError } from "axios";
import { NextRequest } from "next/server";
import { GetWithParams } from "@/libs/fetch";
import { Failed, Success } from "@/libs/message";

export const GET = async (
    req: NextRequest,
    context: { params: Promise<{ endpoint: string }> }
) => {
    const apiKey = req.headers.get("x-nxopen-api-key");

    const handler = GetWithParams<
        { endpoint: string } & Record<string, string>
    >(async (params) => {
        if (!apiKey) return Failed("Missing API Key", 500);

        const { endpoint, ...query } = params;

        try {
            const res = await axios.get(`https://open.api.nexon.com/maplestory/v1/character/${endpoint}`,
                {
                    params: query,
                    headers: { "x-nxopen-api-key": apiKey },
                }
            );
            return Success("캐릭터 정보 조회 성공", 200, { data: res.data });
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

