'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Loader2, Search as SearchIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { findCharacterId } from '@/fetchs/character.fetch';

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
        <div className="flex h-full flex-col">
            <div className="flex flex-1 items-center justify-center px-4">
                <div className="flex w-full max-w-2xl flex-col items-center gap-10 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <span className="relative flex h-24 w-24 items-center justify-center rounded-[28px] border border-border/60 bg-gradient-to-br from-primary/25 via-primary/15 to-primary/5 shadow-inner shadow-primary/20">
                            <Image src="/Reheln.png" alt="Finder" width={96} height={96} priority className="drop-shadow-sm" />
                        </span>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-semibold tracking-tight">어떤 캐릭터를 찾으시나요?</h1>
                            <p className="text-sm text-muted-foreground">
                                Finder 검색에서 캐릭터 이름을 입력하면 상세 정보와 성장 기록을 빠르게 확인할 수 있어요.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="w-full space-y-6">
                        <div className="flex flex-col gap-3 rounded-full border border-border/60 bg-background/80 px-6 py-4 text-left shadow-sm transition focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 sm:flex-row sm:items-center">
                            <SearchIcon className="h-5 w-5 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
                            <Input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="캐릭터 이름을 검색하세요"
                                autoComplete="off"
                                autoFocus
                                className="h-10 flex-1 border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-12 rounded-full px-10 text-base font-semibold shadow-[0_18px_40px_-24px_rgba(79,70,229,0.75)]"
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
        </div>
    );
};

export default SearchPage;
