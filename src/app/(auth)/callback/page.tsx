'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { userStore } from '@/stores/userStore';
import { supabase } from '@/libs/supabaseClient';

const AuthCallbackPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setApiKey = userStore((state) => state.setApiKey);
    const handledRef = useRef(false);

    useEffect(() => {
        if (handledRef.current) return;

        const errorMessage = searchParams.get('error_description') ?? searchParams.get('error');
        const code = searchParams.get('code');

        if (!errorMessage && !code) {
            return;
        }

        handledRef.current = true;

        const handleAuth = async () => {
            try {
                if (errorMessage) {
                    toast.error(errorMessage);
                    router.replace('/sign_in');
                    return;
                }

                if (!code) {
                    toast.error('인증 코드가 전달되지 않았습니다.');
                    router.replace('/sign_in');
                    return;
                }

                const { data, error } = await supabase.auth.exchangeCodeForSession(code);
                if (error) {
                    toast.error(error.message);
                    router.replace('/sign_in');
                    return;
                }

                const apiKey = data.session?.user.user_metadata?.nexon_api_key;
                if (apiKey) setApiKey(apiKey);

                toast.success('로그인되었습니다.');
                router.replace('/home');
            } catch {
                toast.error('소셜 로그인 처리 중 오류가 발생했습니다.');
                router.replace('/sign_in');
            }
        };

        void handleAuth();
    }, [router, searchParams, setApiKey]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">소셜 로그인 처리 중입니다...</p>
            </div>
        </div>
    );
};

export default AuthCallbackPage;

