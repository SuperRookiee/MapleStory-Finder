"use client";

import { useCallback, useMemo } from "react";
import { Trophy, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TODO_LIST_BOSS_GROUPS, TodoListBoss, TodoListBossGroup } from "@/constants/todoList";
import { MonthlyBossState, WeeklyBossState } from "@/fetchs/todoList.fetch";
import { useLanguage, useTranslations } from "@/providers/LanguageProvider";
import { cn } from "@/utils/utils";

interface WeeklyBossPanelProps {
    weeklyState: WeeklyBossState;
    monthlyState: MonthlyBossState;
    onToggleWeekly: (bossId: string, next: boolean) => void;
    onToggleMonthly: (bossId: string, next: boolean) => void;
}

type AggregatedBoss = {
    name: string;
    bosses: TodoListBoss[];
};

type AggregatedBossGroup = TodoListBossGroup & {
    aggregatedBosses: AggregatedBoss[];
};

const DIFFICULTY_LABEL_KEY_MAP: Record<TodoListBoss["difficulty"], string> = {
    Easy: "easy",
    Normal: "normal",
    Hard: "hard",
    Chaos: "chaos",
    Extreme: "extreme",
};

const WeeklyBossPanel = ({ weeklyState, monthlyState, onToggleWeekly, onToggleMonthly }: WeeklyBossPanelProps) => {
    const t = useTranslations();
    const { language } = useLanguage();

    const aggregatedGroups = useMemo<AggregatedBossGroup[]>(() => {
        const difficultyGroups = TODO_LIST_BOSS_GROUPS.map((group) => {
            const uniqueBossMap = new Map<string, AggregatedBoss>();
            const aggregated: AggregatedBoss[] = [];

            group.bosses.forEach((boss) => {
                const key = boss.bossName || boss.label;
                if (!uniqueBossMap.has(key)) {
                    uniqueBossMap.set(key, { name: key, bosses: [] });
                    aggregated.push(uniqueBossMap.get(key)!);
                }
                uniqueBossMap.get(key)!.bosses.push(boss);
            });

            return {
                ...group,
                aggregatedBosses: aggregated,
            };
        });

        return difficultyGroups;
    }, []);

    const aggregatedChecklistBosses = useMemo(
        () =>
            aggregatedGroups
                .filter((group) => group.frequency !== "monthly")
                .flatMap((group) => group.aggregatedBosses),
        [aggregatedGroups],
    );

    const aggregatedMonthlyBosses = useMemo(
        () =>
            aggregatedGroups
                .filter((group) => group.frequency === "monthly")
                .flatMap((group) => group.aggregatedBosses),
        [aggregatedGroups],
    );

    const formatCurrency = useCallback(
        (value: number) => {
            const isKorean = language === "ko";
            const formatter = new Intl.NumberFormat(isKorean ? "ko-KR" : "en-US", {
                maximumFractionDigits: isKorean ? 0 : 1,
            });
            const divisor = isKorean ? 10_000 : 1_000_000;
            const formatted = formatter.format(value / divisor);
            return isKorean ? `${formatted}만` : `${formatted} M`;
        },
        [language],
    );

    const checklistClears = aggregatedChecklistBosses.filter((boss) =>
        boss.bosses.some((entry) => Boolean(weeklyState[entry.id]?.clearedAt)),
    ).length;
    const monthlyClears = aggregatedMonthlyBosses.filter((boss) =>
        boss.bosses.some((entry) => Boolean(monthlyState[entry.id]?.clearedAt)),
    ).length;
    const totalClears = checklistClears + monthlyClears;

    const checklistReward = aggregatedChecklistBosses.reduce((acc, boss) => {
        const cleared = boss.bosses.find((entry) => Boolean(weeklyState[entry.id]?.clearedAt));
        if (cleared) {
            return acc + cleared.reward;
        }
        return acc;
    }, 0);

    const monthlyReward = aggregatedMonthlyBosses.reduce((acc, boss) => {
        const cleared = boss.bosses.find((entry) => Boolean(monthlyState[entry.id]?.clearedAt));
        if (cleared) {
            return acc + cleared.reward;
        }
        return acc;
    }, 0);

    const totalReward = checklistReward + monthlyReward;
    const totalBosses = aggregatedChecklistBosses.length + aggregatedMonthlyBosses.length;
    const completionRate = totalBosses === 0 ? 0 : Math.round((totalClears / totalBosses) * 100);

    return (
        <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-30">
                <Trophy className="absolute -top-12 -left-12 h-48 w-48 rotate-12 text-primary/20" />
                <Zap className="absolute -bottom-12 -right-10 h-40 w-40 -rotate-12 text-primary/10" />
            </div>
            <CardHeader className="relative z-10">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            {t("todoList.bosses.title")}
                        </CardTitle>
                        <CardDescription>{t("todoList.bosses.description")}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {t("todoList.bosses.resetInfo")}
                    </Badge>
                </div>
                <div className="mt-4 grid gap-3 rounded-xl border bg-background/60 p-4 shadow-sm sm:grid-cols-3">
                    <div>
                        <p className="text-xs uppercase text-muted-foreground">
                            {t("todoList.bosses.summary.clears")}
                        </p>
                        <p className="text-xl font-semibold text-foreground">{totalClears}</p>
                        <p className="text-xs text-muted-foreground">
                            {t("todoList.bosses.summary.total", { value: totalBosses })}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-muted-foreground">
                            {t("todoList.bosses.summary.reward")}
                        </p>
                        <p className="text-xl font-semibold text-primary">{formatCurrency(totalReward)}</p>
                        <p className="text-xs text-muted-foreground">{t("todoList.bosses.summary.rewardHint")}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-muted-foreground">
                            {t("todoList.bosses.summary.progress")}
                        </p>
                        <p className="text-xl font-semibold text-foreground">{completionRate}%</p>
                        <p className="text-xs text-muted-foreground">{t("todoList.bosses.summary.progressHint")}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
                <div className="grid gap-4 xl:grid-cols-3">
                    {aggregatedGroups.map((group) => (
                        <div key={group.id} className="space-y-3 rounded-2xl border bg-background/70 p-4 shadow-sm">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                        {t(`todoList.bosses.frequency.${group.frequency}`)}
                                    </p>
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {t(`todoList.bosses.groups.${group.id}.title`)}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t(`todoList.bosses.groups.${group.id}.description`)}
                                    </p>
                                </div>
                                <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                                    {t("todoList.bosses.groupBadge", { count: group.bosses.length })}
                                </Badge>
                            </div>
                            <div className="space-y-2">
                                {group.aggregatedBosses.map((boss) => {
                                    const key = boss.bosses[0]?.id ?? boss.name;
                                    const isMonthly = group.frequency === "monthly";
                                    const getCleared = (bossId: string) =>
                                        isMonthly
                                            ? Boolean(monthlyState[bossId]?.clearedAt)
                                            : Boolean(weeklyState[bossId]?.clearedAt);
                                    const anyCleared = boss.bosses.some((entry) => getCleared(entry.id));
                                    const clearedEntry = boss.bosses.find((entry) => getCleared(entry.id));

                                    const handleToggleDifficulty = (entry: TodoListBoss, next: boolean) => {
                                        if (isMonthly) {
                                            onToggleMonthly(entry.id, next);
                                            if (next) {
                                                boss.bosses.forEach((other) => {
                                                    if (other.id !== entry.id && Boolean(monthlyState[other.id]?.clearedAt)) {
                                                        onToggleMonthly(other.id, false);
                                                    }
                                                });
                                            }
                                        } else {
                                            onToggleWeekly(entry.id, next);
                                            if (next) {
                                                boss.bosses.forEach((other) => {
                                                    if (other.id !== entry.id && Boolean(weeklyState[other.id]?.clearedAt)) {
                                                        onToggleWeekly(other.id, false);
                                                    }
                                                });
                                            }
                                        }
                                    };

                                    return (
                                        <div
                                            key={key}
                                            className={cn(
                                                "flex flex-col gap-3 rounded-xl border px-4 py-3 transition",
                                                anyCleared
                                                    ? "border-primary/70 bg-primary/10"
                                                    : "border-border/70 bg-background/70 hover:border-primary/40",
                                            )}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground">{boss.name}</p>
                                                    {clearedEntry ? (
                                                        <p className="text-xs text-muted-foreground">
                                                            {t("todoList.bosses.rewardLabel", {
                                                                value: formatCurrency(clearedEntry.reward),
                                                            })}
                                                        </p>
                                                    ) : null}
                                                </div>
                                                <Badge
                                                    variant={anyCleared ? "default" : "outline"}
                                                    className={cn(
                                                        "rounded-full px-3 py-1 text-[11px] font-semibold",
                                                        anyCleared
                                                            ? "bg-primary text-primary-foreground"
                                                            : "text-muted-foreground",
                                                    )}
                                                >
                                                    {anyCleared
                                                        ? t("todoList.bosses.status.done")
                                                        : t("todoList.bosses.status.todo")}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {boss.bosses.map((entry) => {
                                                    const cleared = getCleared(entry.id);
                                                    const disabled = anyCleared && !cleared;
                                                    const difficultyKey = DIFFICULTY_LABEL_KEY_MAP[entry.difficulty];
                                                    const difficultyLabel = t(
                                                        `todoList.bosses.difficulties.${difficultyKey}`,
                                                    );

                                                    return (
                                                        <Button
                                                            key={entry.id}
                                                            type="button"
                                                            variant={cleared ? "default" : "outline"}
                                                            size="sm"
                                                            disabled={disabled}
                                                            onClick={() => handleToggleDifficulty(entry, !cleared)}
                                                            className={cn(
                                                                "h-8 rounded-full px-3 text-xs font-semibold",
                                                                !cleared && "text-muted-foreground",
                                                            )}
                                                            title={t("todoList.bosses.rewardLabel", {
                                                                value: formatCurrency(entry.reward),
                                                            })}
                                                        >
                                                            {`${difficultyLabel} · ${formatCurrency(entry.reward)}`}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default WeeklyBossPanel;
