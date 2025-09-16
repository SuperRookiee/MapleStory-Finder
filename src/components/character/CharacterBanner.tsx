"use client";

import Image from "next/image";
import WorldIcon from "@/components/common/WorldIcon";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ICharacterBasic, ICharacterDojang, ICharacterPopularity } from "@/interface/character/ICharacter";
import { IGuildBasic } from "@/interface/guild/IGuild";
import { IUnion } from "@/interface/union/IUnion";
import { cn } from "@/utils/utils";

type CharacterBannerProps = {
    basic: ICharacterBasic | null
    popularity: ICharacterPopularity | null
    union: IUnion | null
    dojang: ICharacterDojang | null
    guild: IGuildBasic | null
    loading: boolean
    imageScale: number
    /** Tailwind background color class for the banner */
    backgroundColor?: string
    /** Optional background image shown behind the character */
    backgroundImage?: string
}

const CharacterBanner = ({
    basic,
    popularity,
    union,
    dojang,
    guild,
    loading,
    imageScale,
    backgroundColor = "bg-card",
    backgroundImage,
}: CharacterBannerProps) => (
    <Card
        className={cn(
            "relative h-60 sm:h-64 w-full overflow-hidden rounded",
            backgroundColor,
        )}
    >
        {backgroundImage && (
            <Image
                src={backgroundImage}
                alt="background"
                fill
                priority
                className="object-cover pointer-events-none"
            />
        )}
        <CardContent>
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
                    <Skeleton className="w-25 h-30" />
                </div>
            </div>
        ) : (
            <>
                <div className="absolute top-2 left-2 bg-muted px-3 py-1 rounded-md text-sm font-medium">
                    <div className="flex gap-1.5">
                        <WorldIcon name={basic.world_name} /> {basic.world_name}
                    </div>
                </div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-muted px-3 py-1 rounded-md text-sm font-medium">
                    Lv. {basic.character_level}
                </div>
                <div className="absolute top-2 right-2 bg-muted px-3 py-1 rounded-md text-sm font-medium">
                    {basic.character_class}
                </div>
                <div className="absolute bottom-12 left-2 space-y-2 text-sm">
                    {union && (
                        <div className="bg-muted px-3 py-1 rounded-md">유니온 {union.union_level}</div>
                    )}
                    {dojang && (
                        <div className="bg-muted px-3 py-1 rounded-md">무릉 {dojang.dojang_best_floor}층</div>
                    )}
                    {popularity && (
                        <div className="bg-muted px-3 py-1 rounded-md">인기도 {popularity.popularity}</div>
                    )}
                </div>
                <div className="absolute bottom-12 right-2 bg-muted px-3 py-1 rounded-md text-sm">
                    {guild?.guild_name && (
                        <div className="bg-muted px-3 py-1 rounded-md">길드 {guild.guild_name}</div>
                    )}
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                    <div className="px-8 py-2 rounded-md bg-primary text-primary-foreground text-sm">
                        {basic.character_name}
                    </div>
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
                            className="object-contain h-auto"
                            priority
                            unoptimized
                        />
                    </div>
                )}
            </>
        )}
        </CardContent>
    </Card>
);

export default CharacterBanner;
