'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Loader2, Search as SearchIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { findCharacterId } from '@/fetchs/character.fetch';

type ApiErrorResponse = {
    error?: {
        message?: string;
    };
};

const SearchPage = () => {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) {
            toast.error('캐릭터 이름을 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            const response = await findCharacterId(trimmed);
            const ocid = response.data.ocid;
            if (!ocid) {
                toast.error('캐릭터를 찾을 수 없습니다. 이름을 확인해주세요.');
                return;
            }
            router.push(`/character/${ocid}`);
        } catch (error) {
            let message = '캐릭터를 찾을 수 없습니다. 이름을 확인해주세요.';
             if (error instanceof Error) {
                message = error.message;
            }
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full flex-col items-center justify-center px-4">
            <div className="flex w-full max-w-2xl flex-col items-center gap-8">
                <div className="flex flex-col items-center gap-3 text-center">
                    <Image src="/Reheln.png" alt="Finder" width={96} height={96} priority />
                    <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
                    <p className="max-w-lg text-balance text-sm text-muted-foreground">
                        원하는 캐릭터를 찾아 상세 정보를 확인할 수 있습니다.
                    </p>
                </div>
                <form onSubmit={handleSearch} className="w-full space-y-6">
                    <div className="flex items-center gap-3 rounded-full border border-input bg-background/80 px-6 py-4 shadow-sm transition focus-within:border-ring focus-within:ring-2 focus-within:ring-ring">
                        <SearchIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        <Input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="캐릭터 이름을 검색하세요"
                            autoComplete="off"
                            autoFocus
                            className="flex-1 border-0 bg-transparent p-0 text-lg shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="rounded-full px-6 py-5 text-base font-medium"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                    검색 중...
                                </>
                            ) : (
                                'Search'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SearchPage;
