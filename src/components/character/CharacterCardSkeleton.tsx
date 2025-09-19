'use client';

import { Card } from '@/components/ui/card';

const CharacterCardSkeleton = () => (
    <Card className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
                <div className="h-5 w-5 animate-pulse rounded-full bg-muted" />
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-9 w-9 rounded-full border border-border/60 bg-muted/40" />
        </div>

        <div className="mt-6 aspect-[4/3] w-full rounded-2xl bg-muted/30" />

        <div className="mt-6 flex items-end justify-between gap-4">
            <div className="w-2/3 space-y-3">
                <div className="h-5 w-full animate-pulse rounded bg-muted/70" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted/60" />
            </div>
            <div className="h-10 w-12 animate-pulse rounded bg-muted/70" />
        </div>
    </Card>
);

export default CharacterCardSkeleton;
