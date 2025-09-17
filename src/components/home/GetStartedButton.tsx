'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

const GetStartedButton = () => {
    const router = useRouter();
    const { status, isLoading } = useAuth();

    const handleClick = useCallback(() => {
        if (isLoading) return;

        if (status === 'authenticated') {
            router.push('/search');
            return;
        }

        router.push('/sign_in');
    }, [isLoading, router, status]);

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isLoading}
            className="group inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-semibold text-slate-950 shadow-[0_18px_45px_-20px_rgba(56,189,248,0.8)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_65px_-25px_rgba(14,165,233,0.9)] disabled:cursor-not-allowed disabled:opacity-70"
        >
            지금 시작하기
            <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
        </button>
    );
};

export default GetStartedButton;
