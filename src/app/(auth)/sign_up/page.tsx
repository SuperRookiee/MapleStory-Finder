'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { userStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Image from "next/image";

const SignUpPage = () => {
    const router = useRouter();
    const setApiKey = userStore((s) => s.setApiKey);
    const [form, setForm] = useState({ email: '', password: '', apiKey: '' });
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

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
        router.push('/');
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen">
            <div className="relative hidden w-1/2 md:block">
                <Image
                    src="https://ssl.nexon.com/s2/game/maplestory/renewal/common/media/artwork/artwork_14.jpg"
                    alt="Cover"
                    className="absolute inset-0 h-full w-full object-cover"
                    fill
                    priority
                />
            </div>
            <div className="flex flex-1 items-center justify-center p-4">
                <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-bold">Sign Up</h1>
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
                    <div className="space-y-2">
                        <Label htmlFor="apiKey">Nexon API Key</Label>
                        <Input
                            id="apiKey"
                            value={form.apiKey}
                            onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Create account...' : 'Create account'}
                    </Button>
                    <p className="text-sm text-center">
                        Already have an account?{' '}
                        <Link href="/sign_in" className="underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;

