import { NextRequest } from "next/server";
import axios, { AxiosError } from "axios";
import { GetWithParams } from "@/utils/fetch";
import { Failed, Success } from "@/utils/message";

const endpointMap: Record<string, { url: string; successMessage: string }> = {
    notice: {
        url: "https://open.api.nexon.com/maplestory/v1/notice",
        successMessage: "공지사항 조회 성공",
    },
    "notice-detail": {
        url: "https://open.api.nexon.com/maplestory/v1/notice/detail",
        successMessage: "공지사항 상세 조회 성공",
    },
    "notice-update": {
        url: "https://open.api.nexon.com/maplestory/v1/notice-update",
        successMessage: "업데이트 공지 조회 성공",
    },
    "notice-update-detail": {
        url: "https://open.api.nexon.com/maplestory/v1/notice-update/detail",
        successMessage: "업데이트 공지 상세 조회 성공",
    },
    "notice-event": {
        url: "https://open.api.nexon.com/maplestory/v1/notice-event",
        successMessage: "이벤트 공지 조회 성공",
    },
    "notice-event-detail": {
        url: "https://open.api.nexon.com/maplestory/v1/notice-event/detail",
        successMessage: "이벤트 공지 상세 조회 성공",
    },
    "notice-cashshop": {
        url: "https://open.api.nexon.com/maplestory/v1/notice-cashshop",
        successMessage: "캐시샵 공지 조회 성공",
    },
    "notice-cashshop-detail": {
        url: "https://open.api.nexon.com/maplestory/v1/notice-cashshop/detail",
        successMessage: "캐시샵 공지 상세 조회 성공",
    },
};

export const GET = async (
    req: NextRequest,
    context: { params: Promise<{ endpoint: string }> },
) => {
    const apiKey =
        req.headers.get("x-nxopen-api-key") || process.env.NEXT_PUBLIC_NEXON_API_KEY;

    const handler = GetWithParams<
        { endpoint: string } & Record<string, string>
    >(async (params) => {
        if (!apiKey) return Failed("Missing API Key", 500);

        const { endpoint, ...query } = params;
        const config = endpointMap[endpoint];

        if (!config) {
            return Failed("Unsupported notice endpoint", 400);
        }

        try {
            const res = await axios.get(config.url, {
                params: query,
                headers: { "x-nxopen-api-key": apiKey },
            });

            return Success(config.successMessage, 200, { data: res.data });
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
