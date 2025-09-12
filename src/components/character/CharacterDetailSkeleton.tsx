'use client';

import ItemEquipmentsSkeleton from "@/components/character/item/ItemEquipmentsSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const CharacterDetailSkeleton = () => (
  <div className="h-page flex flex-col items-center space-y-6 py-6">
    <Skeleton className="w-80 h-80" />
    <div className="w-full max-w-3xl space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={`info-${i}`} className="w-full h-24" />
      ))}
      <ItemEquipmentsSkeleton />
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={`extra-${i}`} className="w-full h-24" />
      ))}
    </div>
  </div>
);

export default CharacterDetailSkeleton;

