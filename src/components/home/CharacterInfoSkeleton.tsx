'use client';

import { Skeleton } from "@/components/ui/skeleton";

const CharacterInfoSkeleton = () => (
  <div className="p-4 max-w-6xl mx-auto">
    <div className="flex flex-col lg:flex-row gap-10">
      <section className="flex-1 flex flex-col items-center space-y-4">
        <div className="self-start flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="w-64 h-64" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-20" />
      </section>
      <div className="flex-1 flex justify-center">
        <div className="w-[420px] mx-auto grid grid-cols-5 gap-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <Skeleton key={i} className="w-16 h-16" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default CharacterInfoSkeleton;

