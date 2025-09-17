'use client';

import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/libs/supabaseClient';
import BackgroundPattern from '@/components/layouts/BackgroundPattern';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/providers/AuthProvider';
import { userStore } from '@/stores/userStore';

const SignInPage = () => {
    const router = useRouter();
    const setApiKey = userStore((s) => s.setApiKey);
    const { loginAsGuest } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [guestLoading, setGuestLoading] = useState(false);

    useEffect(() => {
        const loadSession = async () => {
            const { data } = await supabase.auth.getSession();
            const session = data.session;
            if (session) {
                const key = session.user.user_metadata?.nexon_api_key;
                if (key) setApiKey(key);
                router.replace('/');
            }
        };
        loadSession();
    }, [router, setApiKey]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
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
        toast.success('로그인 성공');
        router.push('/');
        setLoading(false);
    };

    const handleGoogle = async () => {
        setGoogleLoading(true);
        const options =
            window.location.hostname === 'localhost'
                ? undefined
                : { redirectTo: window.location.origin };

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options,
        });
        if (error) {
            toast.error(error.message);
            setGoogleLoading(false);
        }
    };

    const handleGuestLogin = () => {
        setGuestLoading(true);
        try {
            loginAsGuest();
            toast.success('게스트로 입장했습니다.');
            router.push('/search');
        } finally {
            setGuestLoading(false);
        }
    };

    return (
        <BackgroundPattern>
            <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
                <div className="relative w-full max-w-lg">
                    <div className="pointer-events-none absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-br from-primary/25 via-transparent to-primary/10 opacity-80 blur-3xl" />
                    <div className="relative flex flex-col gap-8 overflow-hidden rounded-[32px] border border-border/60 bg-card/80 p-10 shadow-[0_40px_80px_-50px_rgba(15,23,42,0.55)] backdrop-blur-md sm:p-12">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <span className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-border/60 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/5 shadow-inner shadow-primary/20">
                                <Image src="/Reheln.png" alt="Finder" width={56} height={56} priority className="drop-shadow-sm" />
                            </span>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-semibold tracking-tight">Finder에 다시 오신 것을 환영해요</h1>
                                <p className="text-sm text-muted-foreground">
                                    MapleStory 캐릭터를 빠르게 검색하고 즐겨찾기를 한곳에서 관리해보세요.
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
                                    autoComplete="current-password"
                                    className="h-12 rounded-full border-border/60 bg-background/80 px-5 text-base shadow-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="h-12 w-full rounded-full text-base font-semibold shadow-[0_18px_40px_-24px_rgba(79,70,229,0.75)]"
                                disabled={loading}
                            >
                                {loading ? 'Sign In...' : 'Sign In'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-12 w-full rounded-full border-border/60 bg-background/80 text-base font-semibold transition hover:border-primary/40"
                                onClick={handleGoogle}
                                disabled={googleLoading}
                            >
                                {googleLoading ? 'Sign in with Google...' : 'Sign in with Google'}
                            </Button>

                            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                <span className="h-px w-full rounded-full bg-border" />
                                <span>or</span>
                                <span className="h-px w-full rounded-full bg-border" />
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="h-12 w-full rounded-full border-dashed border-border/60 bg-background/70 text-base font-semibold hover:border-primary/40"
                                onClick={handleGuestLogin}
                                disabled={guestLoading}
                            >
                                {guestLoading ? '게스트로 입장 중...' : '게스트로 둘러보기'}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-muted-foreground">
                            아직 계정이 없나요?{' '}
                            <Link href="/sign_up" className="font-semibold text-primary underline-offset-4 hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </BackgroundPattern>
    );
};

export default SignInPage;

