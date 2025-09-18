import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IAchievementRanking, IDojangRanking, IOverallRanking, ITheSeedRanking, IUnionRanking, } from "@/interface/ranking/IRanking";
import { useTranslations } from "@/providers/LanguageProvider";

type RankingSummary = {
    overall: IOverallRanking | null;
    union: IUnionRanking | null;
    dojang: IDojangRanking | null;
    theseed: ITheSeedRanking | null;
    achievement: IAchievementRanking | null;
};

type RankingProps = {
    ranking?: RankingSummary | null;
    loading?: boolean;
};

type RankingItem = {
    key: string;
    label: string;
    value: string;
    helper?: string;
    meta?: string;
};

const formatRecordTime = (seconds?: number) => {
    if (typeof seconds !== "number" || seconds <= 0) return null;

    const totalMinutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const segments: string[] = [];

    if (hours > 0) {
        segments.push(`${hours}h`);
    }

    if (minutes > 0 || hours > 0) {
        segments.push(`${minutes}m`);
    }

    segments.push(`${remainingSeconds.toString().padStart(2, "0")}s`);

    return segments.join(" ");
};

const combineDetails = (...details: (string | null | undefined)[]) => {
    const filtered = details.filter((detail): detail is string => Boolean(detail));
    return filtered.length > 0 ? filtered.join(" · ") : undefined;
};

export const Ranking = ({ ranking, loading }: RankingProps) => {
    const t = useTranslations();
    const numberFormatter = useMemo(() => new Intl.NumberFormat(), []);

    if (loading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{t("character.ranking.title")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-5 w-1/2" />
                </CardContent>
            </Card>
        );
    }

    const items: RankingItem[] = [];

    if (ranking?.overall) {
        items.push({
            key: "overall",
            label: t("character.ranking.overall"),
            value: `#${numberFormatter.format(ranking.overall.ranking)}`,
            helper: t("character.ranking.level", {
                level: numberFormatter.format(ranking.overall.character_level),
            }),
            meta: t("character.ranking.updated", { date: ranking.overall.date }),
        });
    }

    if (ranking?.union) {
        items.push({
            key: "union",
            label: t("character.ranking.union"),
            value: `#${numberFormatter.format(ranking.union.ranking)}`,
            helper: t("character.ranking.unionDetail", {
                level: numberFormatter.format(ranking.union.union_level),
                power: numberFormatter.format(ranking.union.union_power),
            }),
            meta: t("character.ranking.updated", { date: ranking.union.date }),
        });
    }

    if (ranking?.dojang) {
        const floorText = t("character.ranking.floor", {
            floor: numberFormatter.format(ranking.dojang.dojang_floor),
        });
        const record = formatRecordTime(ranking.dojang.dojang_time_record);
        const recordText = record
            ? t("character.ranking.record", { time: record })
            : null;
        const updated = t("character.ranking.updated", { date: ranking.dojang.date });

        items.push({
            key: "dojang",
            label: t("character.ranking.dojang"),
            value: `#${numberFormatter.format(ranking.dojang.ranking)}`,
            helper: floorText,
            meta: combineDetails(recordText, updated),
        });
    }

    if (ranking?.theseed) {
        const floorText = t("character.ranking.floor", {
            floor: numberFormatter.format(ranking.theseed.theseed_floor),
        });
        const record = formatRecordTime(ranking.theseed.theseed_time_record);
        const recordText = record
            ? t("character.ranking.record", { time: record })
            : null;
        const updated = t("character.ranking.updated", { date: ranking.theseed.date });

        items.push({
            key: "theseed",
            label: t("character.ranking.theseed"),
            value: `#${numberFormatter.format(ranking.theseed.ranking)}`,
            helper: floorText,
            meta: combineDetails(recordText, updated),
        });
    }

    if (ranking?.achievement) {
        items.push({
            key: "achievement",
            label: t("character.ranking.achievement"),
            value: `#${numberFormatter.format(ranking.achievement.ranking)}`,
            helper: t("character.ranking.achievementDetail", {
                grade: ranking.achievement.trophy_grade,
                score: numberFormatter.format(ranking.achievement.trophy_score),
            }),
            meta: t("character.ranking.updated", { date: ranking.achievement.date }),
        });
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t("character.ranking.title")}</CardTitle>
            </CardHeader>
            <CardContent>
                {items.length > 0 ? (
                    <ul className="space-y-2">
                        {items.map((item) => (
                            <li
                                key={item.key}
                                className="flex items-start justify-between gap-4"
                            >
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">{item.label}</p>
                                    {item.helper && (
                                        <p className="text-xs text-muted-foreground">
                                            {item.helper}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-xl font-semibold">{item.value}</p>
                                    {item.meta && (
                                        <p className="text-xs text-muted-foreground">
                                            {item.meta}
                                        </p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground text-center">
                        {t("character.ranking.empty")}
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

export default Ranking;
