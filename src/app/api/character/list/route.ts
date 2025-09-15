import axios, { AxiosError } from "axios";
import { ICharacterSummary } from "@/interface/character/ICharacterSummary";
import { Get } from "@/utils/fetch";
import { Failed, Success } from "@/utils/message";

interface ICharacterListApiResponse {
    account_list: {
        account_id: string;
        character_list: ICharacterSummary[];
    }[];
}

export const GET = async (req: Request) => {
    const apiKey =
        req.headers.get("x-nxopen-api-key") || process.env.VITE_NEXON_API_KEY;

    const handler = Get(async () => {
        if (!apiKey) return Failed("Missing API Key", 500);

        try {
            const res = await axios.get<ICharacterListApiResponse>(
                "https://open.api.nexon.com/maplestory/v1/character/list",
                {
                    headers: { "x-nxopen-api-key": apiKey },
                }
            );

            const characters = res.data.account_list.flatMap(
                (account) => account.character_list
            );

            return Success("캐릭터 목록 조회 성공", 200, {
                data: { characters },
            });
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                const message = err.response?.data?.error?.message ?? err.message;
                const status = err.response?.status ?? 500;
                return Failed(message, status);
            }
            if (err instanceof Error) return Failed(err.message, 500);
            return Failed("Unknown error", 500);
        }
    });

    return handler(req);
};

