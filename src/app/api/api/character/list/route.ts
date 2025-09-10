import { Get } from "@/lib/fetch"
import { Success, Failed } from "@/lib/message"
import axios, { AxiosError } from "axios"
import { useApiKeyStore } from "@/store/apiKeyStore";

interface CharacterSummary {
    ocid: string
    character_name: string
    world_name: string
    character_class: string
    character_level: number
}

interface CharacterListResponse {
    account_list: {
        account_id: string
        character_list: CharacterSummary[]
    }[]
}

export const GET = Get(async () => {
    const apiKey = useApiKeyStore(state => state.apiKey)
    console.log(apiKey)
    if (!apiKey) return Failed("Missing API Key", 500)

    try {
        const res = await axios.get<CharacterListResponse>(
            "https://open.api.nexon.com/maplestory/v1/character/list",
            {
                headers: { "x-nxopen-api-key": apiKey },
            }
        )

        console.log(res)

        // 여러 account_list가 있을 수 있어서 flatMap으로 합침
        const characters = res.data.account_list.flatMap(
            (account) => account.character_list
        )

        return Success("캐릭터 목록 조회 성공", 200, { characters })
    } catch (err: unknown) {
        if (err instanceof AxiosError) {
            return Failed(
                err.response?.data?.error?.message ?? err.message,
                err.response?.status ?? 500
            )
        }
        if (err instanceof Error) return Failed(err.message, 500)
        return Failed("Unknown error", 500)
    }
})
