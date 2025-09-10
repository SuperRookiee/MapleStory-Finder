import { NextResponse } from "next/server";
import { Success, Failed } from "@/lib/message";
import axios, { AxiosError } from "axios";

interface CharacterSummary {
    ocid: string;
    character_name: string;
    world_name: string;
    character_class: string;
    character_level: number;
}

interface CharacterListResponse {
    account_list: {
        account_id: string;
        character_list: CharacterSummary[];
    }[];
}

export async function GET(req: Request) {
    const apiKey = req.headers.get("x-nxopen-api-key");
    if (!apiKey)
        return NextResponse.json(Failed("Missing API Key", 500), { status: 500 });

    try {
        const res = await axios.get<CharacterListResponse>(
            "https://open.api.nexon.com/maplestory/v1/character/list",
            {
                headers: { "x-nxopen-api-key": apiKey },
            }
        );

        // 여러 account_list가 있을 수 있어서 flatMap으로 합침
        const characters = res.data.account_list.flatMap(
            (account) => account.character_list
        );

        return NextResponse.json(
            Success("캐릭터 목록 조회 성공", 200, { characters }),
            { status: 200 }
        );
    } catch (err: unknown) {
        if (err instanceof AxiosError) {
            const message = err.response?.data?.error?.message ?? err.message;
            const status = err.response?.status ?? 500;
            return NextResponse.json(Failed(message, status), { status });
        }
        if (err instanceof Error)
            return NextResponse.json(Failed(err.message, 500), { status: 500 });
        return NextResponse.json(Failed("Unknown error", 500), { status: 500 });
    }
}

