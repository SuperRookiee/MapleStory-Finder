import { NextResponse } from "next/server";
import { Success, Failed } from "@/lib/message";
import axios, { AxiosError } from "axios";

export async function GET(req: Request, { params }: { params: { endpoint: string } }) {
    const apiKey = req.headers.get("x-nxopen-api-key");
    if (!apiKey) {
        return NextResponse.json(Failed("Missing API Key", 500), { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    try {
        const res = await axios.get(
            `https://open.api.nexon.com/maplestory/v1/character/${params.endpoint}`,
            {
                params: Object.fromEntries(searchParams.entries()),
                headers: { "x-nxopen-api-key": apiKey },
            }
        );
        return NextResponse.json(
            Success("캐릭터 정보 조회 성공", 200, res.data),
            { status: 200 }
        );
    } catch (err: unknown) {
        if (err instanceof AxiosError) {
            const message = err.response?.data?.error?.message ?? err.message;
            const status = err.response?.status ?? 500;
            return NextResponse.json(Failed(message, status), { status });
        }
        if (err instanceof Error) {
            return NextResponse.json(Failed(err.message, 500), { status: 500 });
        }
        return NextResponse.json(Failed("Unknown error", 500), { status: 500 });
    }
}
