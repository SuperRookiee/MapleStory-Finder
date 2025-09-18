"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { SquareArrowOutUpRight } from "lucide-react";
import WorldIcon from "@/components/common/WorldIcon";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import { ICharacterBasic, ICharacterDojang, ICharacterPopularity } from "@/interface/character/ICharacter";
import { IGuildBasic } from "@/interface/guild/IGuild";
import { IUnion } from "@/interface/union/IUnion";
import { useAuth } from "@/providers/AuthProvider";
import { useTranslations } from "@/providers/LanguageProvider";
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
    /** Preloaded image url shared from the summary panel */
    imageSrc?: string
    /** Shared element transition name */
    imageTransitionName?: string
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
    imageSrc,
    imageTransitionName,
}: CharacterBannerProps) => {
    const router = useRouter();
    const { status } = useAuth();
    const t = useTranslations();
    const bannerImageSrc = imageSrc ?? (basic?.character_image
        ? `/api/crop?url=${encodeURIComponent(basic.character_image)}`
        : null
    );

    const getFigure = () => {
        if (!basic?.character_image) return;
        router.push("/figure");
    };

    return (
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
                            <Skeleton className="w-24 h-6"/>
                        </div>
                        <div className="absolute top-2 right-2">
                            <Skeleton className="w-24 h-6"/>
                        </div>
                        <div className="absolute top-2 left-1/2 -translate-x-1/2">
                            <Skeleton className="w-16 h-6"/>
                        </div>
                        <div className="absolute bottom-12 left-2 space-y-2">
                            <Skeleton className="w-32 h-6"/>
                            <Skeleton className="w-32 h-6"/>
                            <Skeleton className="w-32 h-6"/>
                        </div>
                        <div className="absolute bottom-12 right-2  space-y-2">
                            <Skeleton className="w-32 h-6"/>
                            <Skeleton className="w-32 h-6"/>
                        </div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                            <Skeleton className="w-40 h-8"/>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Skeleton className="w-25 h-30"/>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="absolute top-2 left-2 bg-muted px-2 py-1 rounded-md text-sm font-medium z-10">
                            <div className="flex gap-1.5">
                                <WorldIcon name={basic.world_name}/> {basic.world_name}
                            </div>
                        </div>
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-muted px-2 py-1 rounded-md text-sm font-medium z-10">
                            {t('common.level', { value: basic.character_level })}
                        </div>
                        <div className="absolute top-2 right-2 bg-muted px-2 py-1 rounded-md text-sm font-medium z-10">
                            {basic.character_class}
                        </div>
                        <div className="absolute bottom-12 left-2 space-y-2 text-sm z-10">
                            {union && (
                                <div className="bg-muted px-2 py-1 rounded-md">
                                    {t('character.banner.union', { level: union.union_level })}
                                </div>
                            )}
                            {dojang && (
                                <div className="bg-muted px-2 py-1 rounded-md">
                                    {t('character.banner.dojang', { floor: dojang.dojang_best_floor })}
                                </div>
                            )}
                            {popularity && (
                                <div className="bg-muted px-2 py-1 rounded-md ">
                                    {t('character.banner.popularity', { value: popularity.popularity })}
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-12 right-2 space-y-2 text-sm z-10">
                            {guild?.guild_name && (
                                <div className="bg-muted px-2 py-1 rounded-md">
                                    {t('character.banner.guild', { name: guild.guild_name })}
                                </div>
                            )}
                            {status !== 'guest' &&
                                <div className="bg-muted px-2 py-1 rounded-md flex items-center gap-1 hover:cursor-pointer" onClick={() => getFigure()}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div
                                                className=" bg-muted rounded-md flex items-center gap-2 hover:cursor-pointer"
                                                onClick={() => getFigure()}
                                            >
                                                {t('character.banner.figure')} <SquareArrowOutUpRight size={14}/>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {t('character.banner.figureTooltip')}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            }
                        </div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
                            <div className="px-8 py-1.5 rounded-md bg-primary text-primary-foreground text-sm">
                                {basic.character_name}
                            </div>
                        </div>
                        {bannerImageSrc && (
                            <div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                style={{
                                    transform: `scale(${imageScale})`,
                                    opacity: imageScale,
                                    ...(imageTransitionName
                                        ? { viewTransitionName: imageTransitionName }
                                        : {}),
                                }}
                            >
                                <Image
                                    src={bannerImageSrc}
                                    alt={basic?.character_name ?? "character"}
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
    )
};

export default CharacterBanner;
