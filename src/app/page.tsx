'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { useApiKeyStore } from "@/store/apiKeyStore"
import { toast } from "sonner"
import { findCharacterList } from "@/fetch/character.fetch"
import CharacterCard from "@/components/character-card"

interface CharacterSummary {
    ocid: string
    character_name: string
    world_name: string
    character_class: string
    character_level: number
}

export default function Home() {
    const router = useRouter()
    const setApiKey = useApiKeyStore((s) => s.setApiKey)
    const [characters, setCharacters] = useState<CharacterSummary[]>([])
    const [worldFilter, setWorldFilter] = useState("전체월드")

    useEffect(() => {
        const load = async () => {
            const { data } = await supabase.auth.getSession()
            const session = data.session

            if (!session) {
                router.push("/signin")
                return
            }

            const key = session.user.user_metadata?.nexon_api_key
            if (key) setApiKey(key)

            try {
                findCharacterList().then(data => {
                    setCharacters(data.characters)
                });
            } catch (err: unknown) {
                if (err instanceof Error) {
                    toast.error(err.message)
                }
            }
        }

        load()
    }, [router, setApiKey])

    const worlds = ["전체월드", ...Array.from(new Set(characters.map(c => c.world_name)))]

    return (
        <div className="p-4">
            <select
                value={worldFilter}
                onChange={(e) => setWorldFilter(e.target.value)}
                className="mb-4 rounded border p-2"
            >
                {worlds.map(world => (
                    <option key={world} value={world}>{world}</option>
                ))}
            </select>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {characters
                    .filter(c => worldFilter === "전체월드" || c.world_name === worldFilter)
                    .map((c) => (
                        <CharacterCard key={c.ocid} character={c} />
                    ))}
            </div>
        </div>
    )
}
