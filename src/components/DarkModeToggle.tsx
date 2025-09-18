'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/providers/LanguageProvider';
import { cn } from '@/utils/utils';

type DocumentWithViewTransition = Document & {
    startViewTransition?: (callback: () => void | Promise<void>) => void;
};

let removeTransitionTimeout: number | undefined;

interface IDarkModeToggle {
    className?: string;
}

const DarkModeToggle = ({ className }: IDarkModeToggle) => {
    const t = useTranslations();
    const toggleTheme = () => {
        const root = document.documentElement;
        const nextIsDark = !root.classList.contains('dark');

        const applyTheme = () => {
            root.classList.toggle('dark', nextIsDark);
            localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');
        };

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            applyTheme();
            return;
        }

        const doc = document as DocumentWithViewTransition;

        if (typeof doc.startViewTransition === 'function') {
            try {
                doc.startViewTransition(() => {
                    applyTheme();
                });
            } catch (error) {
                const isInvalidStateError =
                    error instanceof DOMException && error.name === 'InvalidStateError';

                if (!isInvalidStateError) {
                    console.warn('Failed to start view transition', error);
                }

                applyTheme();
            }
            return;
        }

        root.classList.add('dark-theme-transition');
        applyTheme();

        if (removeTransitionTimeout !== undefined) {
            window.clearTimeout(removeTransitionTimeout);
        }

        removeTransitionTimeout = window.setTimeout(() => {
            root.classList.remove('dark-theme-transition');
            removeTransitionTimeout = undefined;
        }, 320);
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={t('common.darkModeToggle.ariaLabel')}
            className={cn('hover:bg-transparent', className)}
        >
            <Sun className="h-5 w-5 text-foreground hidden dark:block"/>
            <Moon className="h-5 w-5 text-foreground block dark:hidden"/>
        </Button>
    );
};

export default DarkModeToggle;
