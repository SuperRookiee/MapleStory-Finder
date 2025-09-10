'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { useApiKeyStore } from "@/store/apiKeyStore"
import { Card } from "@/components/ui/card"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { unwrapOrThrow } from "@/lib/message"
import { findCharacterList } from "@/fetch/character.fetch";

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

    return (
        <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {characters?.map((c) => (
                <Card key={c.ocid} className="p-4">
                    <p className="font-bold">{c.character_name}</p>
                    <p className="text-sm text-muted-foreground">
                        Lv.{c.character_level} {c.character_class} ({c.world_name})
                    </p>
                </Card>
            ))}
        </main>
    )
}