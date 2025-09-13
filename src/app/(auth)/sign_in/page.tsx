'use client';

import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/libs/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userStore } from '@/stores/userStore';

const SignInPage = () => {
    const router = useRouter();
    const setApiKey = userStore((s) => s.setApiKey);
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

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

    return (
        <div className="flex min-h-screen">
            <div className="relative hidden w-1/2 md:block">
                <Image
                    src="https://lwi.nexon.com/maplestory/common/media/artwork/artwork_117.jpg"
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
                        className="w-full"
                        onClick={handleGoogle}
                        disabled={googleLoading}
                    >
                        {googleLoading ? 'Sign in with Google...' : 'Sign in with Google'}
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

