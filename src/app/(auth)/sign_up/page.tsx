'use client';

import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/libs/supabaseClient';
import BackgroundPattern from '@/components/layouts/BackgroundPattern';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userStore } from '@/stores/userStore';

const SignUpPage = () => {
    const router = useRouter();
    const setApiKey = userStore((s) => s.setApiKey);
    const [form, setForm] = useState({ email: '', password: '', apiKey: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: { data: { nexon_api_key: form.apiKey } },
        });
        if (error) {
            toast.error(error.message);
            setLoading(false);
            return;
        }
        const apiKey = data.user?.user_metadata?.nexon_api_key;
        if (apiKey) {
            setApiKey(apiKey);
        }
        toast.success(`${form.email}로 인증 메일이 발송되었습니다. 확인해 주세요.`);
        router.push('/');
        setLoading(false);
    };

    return (
        <BackgroundPattern>
            <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
                <div className="relative w-full max-w-xl">
                    <div className="pointer-events-none absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-br from-primary/25 via-transparent to-primary/10 opacity-80 blur-3xl" />
                    <div className="relative flex flex-col gap-8 overflow-hidden rounded-[32px] border border-border/60 bg-card/80 p-10 shadow-[0_40px_80px_-50px_rgba(15,23,42,0.55)] backdrop-blur-md sm:p-12">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <span className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-border/60 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/5 shadow-inner shadow-primary/20">
                                <Image src="/Reheln.png" alt="Finder" width={56} height={56} priority className="drop-shadow-sm" />
                            </span>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-semibold tracking-tight">Finder에 가입하고 시작해보세요</h1>
                                <p className="text-sm text-muted-foreground">
                                    Nexon API Key를 등록하면 즐겨찾기와 캐릭터 정보를 더 빠르게 불러올 수 있습니다.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2 text-left">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                    autoComplete="email"
                                    className="h-12 rounded-full border-border/60 bg-background/80 px-5 text-base shadow-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                    autoComplete="new-password"
                                    className="h-12 rounded-full border-border/60 bg-background/80 px-5 text-base shadow-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="apiKey">Nexon API Key</Label>
                                    <Link
                                        href="https://openapi.nexon.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                                    >
                                        발급 안내
                                    </Link>
                                </div>
                                <Input
                                    id="apiKey"
                                    value={form.apiKey}
                                    onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                                    required
                                    placeholder="예: NX-..."
                                    className="h-12 rounded-full border-border/60 bg-background/80 px-5 text-base shadow-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
                                />
                                <p className="text-xs text-muted-foreground">
                                    입력한 키는 Supabase 계정 정보에 안전하게 저장되며, 언제든 내 정보에서 수정할 수 있습니다.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="h-12 w-full rounded-full text-base font-semibold shadow-[0_18px_40px_-24px_rgba(79,70,229,0.75)]"
                                disabled={loading}
                            >
                                {loading ? 'Create account...' : 'Create account'}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-muted-foreground">
                            이미 계정이 있으신가요?{' '}
                            <Link href="/sign_in" className="font-semibold text-primary underline-offset-4 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </BackgroundPattern>
    );
};

export default SignUpPage;

