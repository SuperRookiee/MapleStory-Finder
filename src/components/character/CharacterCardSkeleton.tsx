'use client';

import { Card } from '@/components/ui/card';

const CharacterCardSkeleton = () => (
    <Card className="p-4 flex flex-col w-full relative">
        {/* 서버 정보 Skeleton */}
        <div className="absolute top-2 left-2 flex items-center gap-1">
            <div className="w-5 h-5 bg-muted animate-pulse rounded-full" />
            <div className="h-3 w-16 bg-muted animate-pulse rounded" />
        </div>

        {/* 캐릭터 이미지 Skeleton (비율 고정) */}
        <div className="relative w-full aspect-[4/3] mb-4 bg-muted animate-pulse rounded-md" />

        {/* 캐릭터 정보 Skeleton */}
        <div className="mt-auto flex items-end justify-between min-h-[64px] sm:min-h-[72px] md:min-h-[80px]">
            <div className="space-y-2 w-[70%]">
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
            </div>
            <div className="h-6 sm:h-7 md:h-8 lg:h-10 bg-muted animate-pulse rounded w-16" />
        </div>
    </Card>
);

export default CharacterCardSkeleton;
