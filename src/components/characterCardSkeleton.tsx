'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CharacterCardSkeleton() {
  return (
    <Card className="p-4 flex flex-col relative">
      <Skeleton className="absolute top-2 right-2 h-5 w-5 rounded-full" />
      <div className="relative w-full h-60 mb-4">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="mt-auto flex items-end justify-between">
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-8" />
      </div>
    </Card>
  );
}
