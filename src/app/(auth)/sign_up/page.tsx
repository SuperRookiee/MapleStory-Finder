'use client';

import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { userStore } from '@/stores/userStore';
import { supabase } from '@/libs/supabaseClient';
import DarkModeToggle from "@/components/DarkModeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/providers/LanguageProvider';

const SignUpPage = () => {
    const router = useRouter();
    const setApiKey = userStore((s) => s.setApiKey);
    const [form, setForm] = useState({ email: '', password: '', apiKey: '' });
    const [loading, setLoading] = useState(false);
    const t = useTranslations();

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
        toast.success(t('auth.signUp.toast.verificationSent', { email: form.email }));
        router.push('/home');
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen">
            <div className='absolute top-1 right-1 flex gap-1.5'>
                <LanguageToggle />
                <DarkModeToggle />
            </div>
            <div className="relative hidden w-1/2 md:block">
                <Image
                    src="/images/artwork_14.jpg"
                    alt="Cover"
                    className="absolute inset-0 h-full w-full object-cover"
                    fill
                    priority
                />
            </div>
            <div className="flex flex-1 items-center justify-center p-4">
                <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-bold">{t('auth.signUp.title')}</h1>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('auth.signUp.emailLabel')}</Label>
                        <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">{t('auth.signUp.passwordLabel')}</Label>
                        <Input
                            id="password"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="apiKey">{t('auth.signUp.apiKeyLabel')}</Label>
                        <Input
                            id="apiKey"
                            value={form.apiKey}
                            onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? t('auth.signUp.submitting') : t('auth.signUp.submit')}
                    </Button>
                    <p className="text-sm text-center">
                        {t('auth.signUp.alreadyHave')} {' '}
                        <Link href="/sign_in" className="underline">
                            {t('auth.signUp.signInCta')}
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;

