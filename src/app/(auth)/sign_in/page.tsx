'use client';

import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type SVGProps, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { userStore } from '@/stores/userStore';
import { supabase } from '@/libs/supabaseClient';
import DarkModeToggle from "@/components/DarkModeToggle";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/providers/AuthProvider';

type IconProps = SVGProps<SVGSVGElement>;

const GoogleIcon = (props: IconProps) => (
    <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            fill="#EA4335"
            d="M12.24 10.26v3.54h5.05c-.21 1.18-.83 2.18-1.78 2.85l2.86 2.22c1.67-1.54 2.66-3.82 2.66-6.61 0-.63-.06-1.23-.17-1.8z"
        />
        <path
            fill="#4285F4"
            d="M12 5.5c1.63 0 3.1.56 4.26 1.65l2.62-2.62C16.83 2.6 14.63 1.75 12 1.75 7.79 1.75 4.13 4.2 2.56 7.87l3.1 2.38C6.53 7.47 8.98 5.5 12 5.5z"
        />
        <path
            fill="#FBBC05"
            d="M12 22.25c2.58 0 4.93-.85 6.57-2.31l-2.86-2.22c-.8.55-1.85.93-3.71.93-2.99 0-5.51-1.99-6.42-4.68l-3.1 2.39C4.05 19.92 7.64 22.25 12 22.25z"
        />
        <path
            fill="#34A853"
            d="M5.58 13.97a6.72 6.72 0 0 1-.33-2.22c0-.77.12-1.51.33-2.22l-3.1-2.38A10.17 10.17 0 0 0 1.75 11.75c0 1.61.37 3.14 1.1 4.6z"
        />
        <path fill="none" d="M1.75 1.75h20.5v20.5H1.75z" />
    </svg>
);

const KakaoIcon = (props: IconProps) => (
    <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        {...props}
    >
        <rect width="24" height="24" rx="6" fill="#FEE500" />
        <path
            fill="#381E1F"
            d="M12 6.25c-3.44 0-6.25 2.04-6.25 4.57 0 1.69 1.12 3.16 2.83 3.99l-.87 2.63 2.64-1.62c.51.09 1.04.13 1.65.13 3.44 0 6.25-2.04 6.25-4.57S15.44 6.25 12 6.25z"
        />
    </svg>
);

const SignInPage = () => {
    const router = useRouter();
    const setApiKey = userStore((s) => s.setApiKey);
    const { loginAsGuest } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [guestLoading, setGuestLoading] = useState(false);
    const [kakaoLoading, setKakaoLoading] = useState(false);

    const createRedirectTo = () => {
        const envUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL;
        const envUrlValue = envUrl && envUrl !== 'undefined' ? envUrl : undefined;
        const fallbackUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const baseUrl = envUrlValue ?? fallbackUrl;
        const normalizedUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
        return `${normalizedUrl.replace(/\/$/, '')}/home`;
    };

    useEffect(() => {
        const loadSession = async () => {
            const { data } = await supabase.auth.getSession();
            const session = data.session;
            if (session) {
                const key = session.user.user_metadata?.nexon_api_key;
                if (key) setApiKey(key);
                router.replace('/home');
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
        router.push('/home');
        setLoading(false);
    };

    const handleGoogle = async () => {
        setGoogleLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: createRedirectTo() },
            });

            if (error) {
                toast.error(error.message);
                setGoogleLoading(false);
            }
        } catch {
            toast.error('구글 로그인 중 문제가 발생했습니다.');
            setGoogleLoading(false);
        }
    };

    const handleKakao = async () => {
        setKakaoLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'kakao',
                options: { redirectTo: createRedirectTo() },
            });

            if (error) {
                toast.error(error.message);
                setKakaoLoading(false);
            }
        } catch {
            toast.error('카카오 로그인 중 문제가 발생했습니다.');
            setKakaoLoading(false);
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
        <div className="flex min-h-screen">
            <DarkModeToggle className='absolute top-1 left-full'/>
            <div className="relative hidden w-1/2 md:block">
                <Image
                    src="/images/artwork_117.jpg"
                    alt="Cover"
                    className="absolute inset-0 h-full w-full object-cover"
                    fill
                    priority
                />
            </div>
            <div className="flex flex-1 items-center justify-center p-4">
                <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-bold">Sign In</h1>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Sign In...' : 'Sign In'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2"
                        onClick={handleGoogle}
                        disabled={googleLoading || kakaoLoading}
                    >
                        <GoogleIcon className="h-5 w-5" />
                        {googleLoading ? '구글로 로그인 중...' : '구글로 로그인'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2"
                        onClick={handleKakao}
                        disabled={kakaoLoading || googleLoading}
                    >
                        <KakaoIcon className="h-5 w-5" />
                        {kakaoLoading ? '카카오로 로그인 중...' : '카카오로 로그인'}
                    </Button>
                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-gray-300" />
                        <span className="mx-4 flex-shrink text-xs font-semibold tracking-wide text-muted-foreground">OR</span>
                        <div className="flex-grow border-t border-gray-300" />
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGuestLogin}
                        disabled={guestLoading}
                    >
                        {guestLoading ? '게스트로 입장 중...' : '게스트로 둘러보기'}
                    </Button>
                    <p className="text-sm text-center">
                        Don&apos;t have an account?{' '}
                        <Link href="/sign_up" className="underline">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignInPage;

