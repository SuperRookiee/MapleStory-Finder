"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    TODO_LIST_CHECKLIST_GROUPS,
    TODO_LIST_MONTHLY_BOSS_IDS,
    getBossReward,
    getWeeklyBossCount,
} from "@/constants/todoList";
import {
    loadMonthlyBossHistory,
    loadWeeklyBossHistory,
    MonthlyBossHistoryEntry,
    WeeklyBossHistoryEntry,
} from "@/fetchs/todoList.fetch";
import { useLanguage, useTranslations } from "@/providers/LanguageProvider";
import { formatKstDateLabel, formatKstMonthLabel } from "@/utils/date";

const DashboardPage = () => {
    const t = useTranslations();
    const { language } = useLanguage();
    const [weeklyHistory, setWeeklyHistory] = useState<WeeklyBossHistoryEntry[]>([]);
    const [monthlyHistory, setMonthlyHistory] = useState<MonthlyBossHistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = useCallback(
        (error: unknown) => {
            const message = error instanceof Error ? error.message : t("todoList.toast.error");
            toast.error(message);
        },
        [t],
    );

    useEffect(() => {
        setIsLoading(true);
        Promise.all([loadWeeklyBossHistory(12), loadMonthlyBossHistory(6)])
            .then(([weekly, monthly]) => {
                setWeeklyHistory(weekly);
                setMonthlyHistory(monthly);
            })
            .catch(handleError)
            .finally(() => {
                setIsLoading(false);
            });
    }, [handleError]);

    const latestWeekly = weeklyHistory.at(-1);

    const formatReward = useCallback(
        (value: number) => {
            if (language === "ko") {
                return `${new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 1 }).format(value / 1_000_000_000)}억`;
            }
            return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value / 1_000_000_000)} B`;
        },
        [language],
    );

    const latestWeeklyStats = useMemo(() => {
        if (!latestWeekly) {
            return { cleared: 0, reward: 0, rate: 0 };
        }
        const cleared = Object.values(latestWeekly.state).filter((entry) => entry?.clearedAt).length;
        const reward = Object.entries(latestWeekly.state).reduce((acc, [bossId, entry]) => {
            if (entry?.clearedAt) {
                return acc + getBossReward(bossId);
            }
            return acc;
        }, 0);
        const total = getWeeklyBossCount();
        const rate = total === 0 ? 0 : Math.round((cleared / total) * 100);
        return { cleared, reward, rate };
    }, [latestWeekly]);

    const monthlyClears = useMemo(() => {
        return monthlyHistory.reduce((acc, entry) => {
            const clearedCount = Object.values(entry.state).filter((item) => item?.clearedAt).length;
            return acc + clearedCount;
        }, 0);
    }, [monthlyHistory]);

    const weeklyChartData = useMemo(() => {
        return weeklyHistory.map((entry) => {
            const cleared = Object.values(entry.state).filter((item) => item?.clearedAt).length;
            const reward = Object.entries(entry.state).reduce((acc, [bossId, item]) => {
                if (item?.clearedAt) {
                    return acc + getBossReward(bossId);
                }
                return acc;
            }, 0);
            return {
                period: formatKstDateLabel(entry.periodKey, language),
                cleared,
                rewardBillions: reward / 1_000_000_000,
            };
        });
    }, [language, weeklyHistory]);

    const monthlyChartData = useMemo(() => {
        return monthlyHistory.map((entry) => {
            const cleared = Object.values(entry.state).filter((item) => item?.clearedAt).length;
            return {
                month: formatKstMonthLabel(entry.periodKey.slice(0, 7), language),
                cleared,
            };
        });
    }, [language, monthlyHistory]);

    const groupStats = useMemo(() => {
        if (!latestWeekly) {
            return TODO_LIST_CHECKLIST_GROUPS.map((group) => ({
                id: group.id,
                title: group.title,
                cleared: 0,
                total: group.bosses.length,
                reward: 0,
            }));
        }
        return TODO_LIST_CHECKLIST_GROUPS.map((group) => {
            const cleared = group.bosses.filter((boss) => latestWeekly.state[boss.id]?.clearedAt).length;
            const reward = group.bosses.reduce((acc, boss) => {
                if (latestWeekly.state[boss.id]?.clearedAt) {
                    return acc + boss.reward;
                }
                return acc;
            }, 0);
            return {
                id: group.id,
                title: group.title,
                cleared,
                total: group.bosses.length,
                reward,
            };
        });
    }, [latestWeekly]);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 pb-6">
                <Skeleton className="h-[160px] w-full rounded-3xl" />
                <Skeleton className="h-[360px] w-full rounded-3xl" />
                <Skeleton className="h-[320px] w-full rounded-3xl" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 pb-6">
            <section className="grid gap-4 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("todoList.dashboard.cards.weeklyClears.title")}</CardTitle>
                        <CardDescription>{t("todoList.dashboard.cards.weeklyClears.description")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-foreground">{latestWeeklyStats.cleared}</p>
                        <p className="text-sm text-muted-foreground">
                            {t("todoList.dashboard.cards.weeklyClears.subtitle", {
                                total: getWeeklyBossCount(),
                            })}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t("todoList.dashboard.cards.reward.title")}</CardTitle>
                        <CardDescription>{t("todoList.dashboard.cards.reward.description")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-primary">
                            {formatReward(latestWeeklyStats.reward)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {t("todoList.dashboard.cards.reward.subtitle")}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t("todoList.dashboard.cards.progress.title")}</CardTitle>
                        <CardDescription>{t("todoList.dashboard.cards.progress.description")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-foreground">{latestWeeklyStats.rate}%</p>
                        <p className="text-sm text-muted-foreground">
                            {t("todoList.dashboard.cards.progress.subtitle")}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t("todoList.dashboard.cards.monthly.title")}</CardTitle>
                        <CardDescription>{t("todoList.dashboard.cards.monthly.description")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-foreground">{monthlyClears}</p>
                        <p className="text-sm text-muted-foreground">
                            {t("todoList.dashboard.cards.monthly.subtitle", { value: monthlyHistory.length })}
                        </p>
                    </CardContent>
                </Card>
            </section>

            <Card className="overflow-hidden">
                <CardHeader>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>{t("todoList.dashboard.weeklyTrend.title")}</CardTitle>
                            <CardDescription>{t("todoList.dashboard.weeklyTrend.description")}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {t("todoList.dashboard.weeklyTrend.badge")}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyChartData} margin={{ left: 12, right: 12, top: 8, bottom: 0 }}>
                            <defs>
                                <linearGradient id="rewardGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.6} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                            <YAxis
                                yAxisId="left"
                                dataKey="cleared"
                                stroke="hsl(var(--muted-foreground))"
                                allowDecimals={false}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="hsl(var(--muted-foreground))"
                                tickFormatter={(value) => `${value}`}
                                allowDecimals={false}
                            />
                            <Tooltip
                                formatter={(value: number, name) => {
                                    if (name === "rewardBillions") {
                                        return [formatReward(value * 1_000_000_000), t("todoList.dashboard.weeklyTrend.rewardLabel")];
                                    }
                                    return [value, t("todoList.dashboard.weeklyTrend.clearLabel")];
                                }}
                            />
                            <Legend />
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="cleared"
                                stroke="var(--primary)"
                                fill="var(--primary)"
                                fillOpacity={0.15}
                                name={t("todoList.dashboard.weeklyTrend.clears")}
                                strokeWidth={2}
                                dot={{ r: 3 }}
                            />
                            <Area
                                yAxisId="right"
                                type="monotone"
                                dataKey="rewardBillions"
                                stroke="var(--chart-2, hsl(var(--primary)))"
                                fill="url(#rewardGradient)"
                                name={t("todoList.dashboard.weeklyTrend.reward")}
                                strokeWidth={2}
                                dot={{ r: 3 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("todoList.dashboard.groupStats.title")}</CardTitle>
                        <CardDescription>{t("todoList.dashboard.groupStats.description")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {groupStats.map((group) => (
                            <div
                                key={group.id}
                                className="flex items-center justify-between rounded-2xl border bg-background/60 px-4 py-3"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        {t(`todoList.bosses.groups.${group.id}.title`)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t("todoList.dashboard.groupStats.subtitle", {
                                            cleared: group.cleared,
                                            total: group.total,
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-primary">{formatReward(group.reward)}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {t("todoList.dashboard.groupStats.reward")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t("todoList.dashboard.monthly.title")}</CardTitle>
                        <CardDescription>{t("todoList.dashboard.monthly.description")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                                    <YAxis
                                        allowDecimals={false}
                                        stroke="hsl(var(--muted-foreground))"
                                        domain={[0, TODO_LIST_MONTHLY_BOSS_IDS.length]}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [
                                            t("todoList.dashboard.monthly.tooltipValue", {
                                                value,
                                                total: TODO_LIST_MONTHLY_BOSS_IDS.length,
                                            }),
                                            t("todoList.dashboard.monthly.tooltipLabel"),
                                        ]}
                                    />
                                    <Bar
                                        dataKey="cleared"
                                        fill="var(--primary)"
                                        radius={[8, 8, 0, 0]}
                                        name={t("todoList.dashboard.monthly.barLabel")}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="rounded-xl border bg-background/60 p-4 text-sm text-muted-foreground">
                            <p>
                                {t("todoList.dashboard.monthly.summary", {
                                    value: monthlyClears,
                                    total: TODO_LIST_MONTHLY_BOSS_IDS.length,
                                })}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
