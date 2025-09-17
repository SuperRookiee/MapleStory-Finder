import type { ReactNode } from 'react';
import { cn } from '@/utils/utils';

interface BackgroundPatternProps {
    children: ReactNode;
    className?: string;
}

const BackgroundPattern = ({ children, className }: BackgroundPatternProps) => {
    return (
        <div className={cn('relative flex min-h-screen w-full flex-col overflow-hidden bg-background', className)}>
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-70 dark:from-primary/5" />
                <div className="absolute left-1/2 top-[-35%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/20 opacity-40 blur-[160px]" />
                <div className="absolute bottom-[-35%] left-[-10%] h-[480px] w-[480px] rounded-full bg-blue-500/15 opacity-30 blur-[160px] dark:bg-blue-400/10" />
                <div className="absolute right-[-20%] top-1/3 h-[460px] w-[460px] rounded-full bg-amber-400/20 opacity-35 blur-[160px] dark:bg-amber-300/10" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(0deg,rgba(148,163,184,0.18)_1px,transparent_1px)] bg-[length:60px_60px] opacity-[0.18] dark:opacity-10" />
            </div>
            <div className="relative flex min-h-screen flex-1 flex-col">{children}</div>
        </div>
    );
};

export default BackgroundPattern;
