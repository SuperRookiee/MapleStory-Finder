"use client";

import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { ICharacterBasic, ICharacterPopularity } from "@/interface/character/ICharacter";

type CharacterBannerProps = {
    basic: ICharacterBasic | null
    popularity: ICharacterPopularity | null
    loading: boolean
    imageScale: number
}

const CharacterBanner = ({ basic, popularity, loading, imageScale }: CharacterBannerProps) => (
    <div className="relative h-40 w-full max-w-xl mx-auto rounded-lg border bg-card">
        {loading || !basic ? (
            <div className="absolute inset-0 animate-pulse">
                <div className="absolute top-2 left-2">
                    <Skeleton className="w-24 h-6" />
                </div>
                <div className="absolute top-2 right-2">
                    <Skeleton className="w-24 h-6" />
                </div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2">
                    <Skeleton className="w-16 h-6" />
                </div>
                <div className="absolute bottom-12 left-2 space-y-2">
                    <Skeleton className="w-32 h-6" />
                    <Skeleton className="w-32 h-6" />
                    <Skeleton className="w-32 h-6" />
                </div>
                <div className="absolute bottom-12 right-2">
                    <Skeleton className="w-32 h-6" />
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                    <Skeleton className="w-40 h-8" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Skeleton className="w-24 h-24 rounded-full" />
                </div>
            </div>
        ) : (
            <>
                <div className="absolute top-2 left-2 bg-muted px-3 py-1 rounded-md text-sm font-medium">
                    {basic.character_name}
                </div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-muted px-3 py-1 rounded-md text-sm font-medium">
                    Lv. {basic.character_level}
                </div>
                <div className="absolute top-2 right-2 bg-muted px-3 py-1 rounded-md text-sm font-medium">
                    {basic.character_class}
                </div>
                <div className="absolute bottom-12 left-2 space-y-2 text-sm">
                    <div className="bg-muted px-3 py-1 rounded-md">{basic.world_name}</div>
                    {basic.character_guild_name && (
                        <div className="bg-muted px-3 py-1 rounded-md">
                            {basic.character_guild_name}
                        </div>
                    )}
                    {popularity && (
                        <div className="bg-muted px-3 py-1 rounded-md">
                            인기도 {popularity.popularity}
                        </div>
                    )}
                </div>
                <div className="absolute bottom-12 right-2 bg-muted px-3 py-1 rounded-md text-sm">
                    {basic.character_class_level}
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                    <button className="px-8 py-2 rounded-md bg-primary text-primary-foreground text-sm">
                        자세히 보기
                    </button>
                </div>
                {basic.character_image && (
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{ transform: `scale(${imageScale})`, opacity: imageScale }}
                    >
                        <Image
                            src={`/api/crop?url=${encodeURIComponent(basic.character_image)}`}
                            alt={basic.character_name}
                            width={120}
                            height={120}
                            className="object-contain"
                            priority
                            unoptimized
                        />
                    </div>
                )}
            </>
        )}
    </div>
);

export default CharacterBanner;
