"use client";

import { useCallback } from "react";
import { Trophy, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TODO_LIST_BOSS_GROUPS, getBossReward } from "@/constants/todoList";
import { MonthlyBossState, WeeklyBossState } from "@/fetchs/todoList.fetch";
import { useLanguage, useTranslations } from "@/providers/LanguageProvider";
import { cn } from "@/utils/utils";

interface WeeklyBossPanelProps {
    weeklyState: WeeklyBossState;
    monthlyState: MonthlyBossState;
    onToggleWeekly: (bossId: string, next: boolean) => void;
    onToggleMonthly: (bossId: string, next: boolean) => void;
}

const WeeklyBossPanel = ({ weeklyState, monthlyState, onToggleWeekly, onToggleMonthly }: WeeklyBossPanelProps) => {
    const t = useTranslations();
    const { language } = useLanguage();

    const formatCurrency = useCallback(
        (value: number) => {
            const formatter = new Intl.NumberFormat(language === "ko" ? "ko-KR" : "en-US", {
                maximumFractionDigits: language === "ko" ? 0 : 1,
            });
            const formatted = formatter.format(value / 1_000_000);
            return language === "ko" ? `${formatted}만` : `${formatted} M`;
        },
        [language],
    );

    const checklistClears = Object.values(weeklyState).filter((entry) => Boolean(entry?.clearedAt)).length;
    const monthlyClears = Object.values(monthlyState).filter((entry) => Boolean(entry?.clearedAt)).length;
    const totalClears = checklistClears + monthlyClears;

    const checklistReward = Object.entries(weeklyState).reduce((acc, [bossId, entry]) => {
        if (entry?.clearedAt) {
            return acc + getBossReward(bossId);
        }
        return acc;
    }, 0);

    const monthlyReward = Object.entries(monthlyState).reduce((acc, [bossId, entry]) => {
        if (entry?.clearedAt) {
            return acc + getBossReward(bossId);
        }
        return acc;
    }, 0);

    const totalReward = checklistReward + monthlyReward;
    const totalBosses = TODO_LIST_BOSS_GROUPS.reduce((acc, group) => acc + group.bosses.length, 0);
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
                    {TODO_LIST_BOSS_GROUPS.map((group) => (
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
                                {group.bosses.map((boss) => {
                                    const cleared =
                                        group.frequency === "monthly"
                                            ? Boolean(monthlyState[boss.id]?.clearedAt)
                                            : Boolean(weeklyState[boss.id]?.clearedAt);
                                    const handleToggle = () => {
                                        if (group.frequency === "monthly") {
                                            onToggleMonthly(boss.id, !cleared);
                                        } else {
                                            onToggleWeekly(boss.id, !cleared);
                                        }
                                    };
                                    return (
                                        <button
                                            key={boss.id}
                                            type="button"
                                            onClick={handleToggle}
                                            className={cn(
                                                "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition",
                                                cleared
                                                    ? "border-primary/70 bg-primary/10 text-primary"
                                                    : "border-border/70 bg-background/70 hover:border-primary/40",
                                            )}
                                            >
                                                <div>
                                                    <p className="text-sm font-semibold">{boss.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {t("todoList.bosses.rewardLabel", { value: formatCurrency(boss.reward) })}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={cleared ? "default" : "outline"}
                                                    className={cn(
                                                        "rounded-full px-3 py-1 text-[11px] font-semibold",
                                                        cleared ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                                                    )}
                                                >
                                                    {cleared
                                                        ? t("todoList.bosses.status.done")
                                                        : t("todoList.bosses.status.todo")}
                                                </Badge>
                                            </button>
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
