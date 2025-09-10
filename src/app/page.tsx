'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useApiKeyStore } from '@/store/apiKeyStore';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Character {
  character_name: string;
}

export default function Home() {
  const router = useRouter();
  const setApiKey = useApiKeyStore((s) => s.setApiKey);
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;
      if (!session) {
        router.push('/signin');
        return;
      }
      const apiKey = session.user.user_metadata?.nexon_api_key;
      if (apiKey) {
        setApiKey(apiKey);
      }
      try {
        // TODO: Replace with real character names fetched for the user
        const names = ['캐릭터1', '캐릭터2'];
        const res = await Promise.all(
          names.map((name) =>
            api.get('/character/basic', { params: { character_name: name } })
          )
        );
        setCharacters(res.map((r) => r.data as Character));
      } catch (err) {
        console.error(err);
        toast.error('Failed to load characters');
      }
    });
  }, [router, setApiKey]);

  return (
    <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {characters.map((c) => (
        <Card key={c.character_name} className="p-4">
          {c.character_name}
        </Card>
      ))}
    </main>
  );
}
