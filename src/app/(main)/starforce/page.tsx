"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { findStarforceHistory } from "@/fetchs/history.fetch";
import { StarforceHistoryEntry } from "@/interface/history/IHistory";
import { useTranslations } from "@/providers/LanguageProvider";

const getTodayKstDate = () => {
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60_000;
    const kst = new Date(utcTime + 9 * 60 * 60_000);
    return kst.toISOString().slice(0, 10);
};

const formatDateTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleString();
};

const isActiveFlag = (value?: string | null) => {
    if (!value) return false;
    const normalized = value.trim().toLowerCase();
    if (!normalized) return false;
    return !["n", "미적용", "없음", "false", "0"].includes(normalized);
};

const StarforcePage = () => {
    const t = useTranslations();
    const [date, setDate] = useState(getTodayKstDate());
    const [countInput, setCountInput] = useState("20");
    const [entries, setEntries] = useState<StarforceHistoryEntry[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [lastParams, setLastParams] = useState<{ count: number; date?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [totalFetched, setTotalFetched] = useState(0);

    const fetchHistory = useCallback(
        async (
            baseParams: { count: number; date?: string },
            options: { cursor?: string | null; append: boolean },
        ) => {
            if (options.append) {
                setIsLoadingMore(true);
            } else {
                setIsLoading(true);
            }

            try {
                const response = await findStarforceHistory({
                    ...baseParams,
                    ...(options.cursor ? { cursor: options.cursor } : {}),
                });
                const payload = response.data;
                const history = payload.starforce_history ?? [];

                setEntries((prev) => (options.append ? [...prev, ...history] : history));
                setNextCursor(payload.next_cursor ?? null);
                setHasSearched(true);
                setTotalFetched((prev) => (options.append ? prev + history.length : history.length));

                if (!options.append) {
                    setLastParams(baseParams);
                }
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : t("history.common.error");
                toast.error(message);
            } finally {
                if (options.append) {
                    setIsLoadingMore(false);
                } else {
                    setIsLoading(false);
                }
            }
        },
        [t],
    );

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const parsedCount = Number(countInput);

        if (!Number.isInteger(parsedCount) || parsedCount < 10 || parsedCount > 1000) {
            toast.error(t("history.common.countError"));
            return;
        }

        const baseParams: { count: number; date?: string } = {
            count: parsedCount,
        };

        if (date) {
            baseParams.date = date;
        }

        await fetchHistory(baseParams, { append: false });
    };

    const handleLoadMore = async () => {
        if (!nextCursor || !lastParams) return;
        await fetchHistory(lastParams, { append: true, cursor: nextCursor });
    };

    const flagBadges = useCallback(
        (entry: StarforceHistoryEntry) => {
            const flags: { value?: string | null; label: string }[] = [
                { value: entry.superior_item_flag, label: t("history.starforce.flags.superior") },
                { value: entry.starcatch_result, label: t("history.starforce.flags.starcatch") },
                { value: entry.destroy_defence, label: t("history.starforce.flags.destroyDefence") },
                { value: entry.chance_time, label: t("history.starforce.flags.chanceTime") },
                { value: entry.event_field_flag, label: t("history.starforce.flags.eventField") },
                { value: entry.protect_shield, label: t("history.starforce.flags.protectShield") },
                { value: entry.bonus_stat_upgrade, label: t("history.starforce.flags.bonusStat") },
            ];

            return flags
                .filter((flag) => isActiveFlag(flag.value))
                .map((flag) => (
                    <Badge key={flag.label} variant="secondary">
                        {flag.label}
                    </Badge>
                ));
        },
        [t],
    );

    const eventBadges = useCallback((entry: StarforceHistoryEntry) => {
        const events = entry.starforce_event_list ?? [];

        if (!events.length) {
            return null;
        }

        return (
            <div className="flex flex-wrap gap-2">
                {events.map((event, index) => {
                    const description = [
                        event.starforce_event_range,
                        event.success_rate ? `${t("history.starforce.event.success")}: ${event.success_rate}` : null,
                        event.destroy_decrease_rate
                            ? `${t("history.starforce.event.destroy")}: ${event.destroy_decrease_rate}`
                            : null,
                        event.cost_discount_rate
                            ? `${t("history.starforce.event.discount")}: ${event.cost_discount_rate}`
                            : null,
                        event.plus_value
                            ? `${t("history.starforce.event.plus")}: ${event.plus_value}`
                            : null,
                    ]
                        .filter(Boolean)
                        .join(" · ");

                    return (
                        <Badge key={`${entry.id}-event-${index}`} variant="outline" className="whitespace-normal">
                            {description}
                        </Badge>
                    );
                })}
            </div>
        );
    }, [t]);

    const renderContent = useMemo(() => {
        if (isLoading && entries.length === 0) {
            return (
                <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
                </div>
            );
        }

        if (entries.length === 0) {
            return (
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                    {hasSearched ? t("history.common.empty") : t("history.common.initial")}
                </div>
            );
        }

        return (
            <div className="grid gap-4">
                {entries.map((entry) => (
                    <Card key={entry.id} className="border border-border/60">
                        <CardHeader className="pb-0">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="space-y-1">
                                    <CardTitle className="text-base">
                                        {entry.target_item}
                                    </CardTitle>
                                    <CardDescription className="flex flex-col gap-0.5 text-xs">
                                        <span>
                                            {entry.character_name}
                                            {entry.world_name ? ` · ${entry.world_name}` : ""}
                                        </span>
                                        <span>{formatDateTime(entry.date_create)}</span>
                                    </CardDescription>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge>{entry.item_upgrade_result}</Badge>
                                    <Badge variant="outline">
                                        {t("history.starforce.labels.stars", {
                                            before: entry.before_starforce_count,
                                            after: entry.after_starforce_count,
                                        })}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pb-6 pt-4 text-sm">
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                {entry.upgrade_item && (
                                    <span>
                                        {t("history.starforce.labels.scroll")}: {entry.upgrade_item}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs">
                                {flagBadges(entry)}
                            </div>
                            {eventBadges(entry)}
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }, [entries, eventBadges, flagBadges, hasSearched, isLoading, t]);

    return (
        <ScrollArea className="h-page">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-1 pb-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold">
                        {t("history.starforce.title")}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t("history.starforce.description")}
                    </p>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <form
                            onSubmit={handleSubmit}
                            className="grid gap-4 md:grid-cols-[repeat(4,minmax(0,1fr))]"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="date">
                                    {t("history.common.form.date")}
                                </label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={date}
                                    max={getTodayKstDate()}
                                    onChange={(event) => setDate(event.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="count">
                                    {t("history.common.form.count")}
                                </label>
                                <Input
                                    id="count"
                                    type="number"
                                    min={10}
                                    max={1000}
                                    value={countInput}
                                    onChange={(event) => setCountInput(event.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {t("history.common.form.countHint")}
                                </p>
                            </div>
                            <div className="flex items-end">
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                            {t("history.common.form.loading")}
                                        </>
                                    ) : (
                                        t("history.common.form.submit")
                                    )}
                                </Button>
                            </div>
                            {totalFetched > 0 && (
                                <div className="flex items-end text-sm text-muted-foreground">
                                    {t("history.common.form.result", { count: totalFetched })}
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
                {renderContent}
                {nextCursor && entries.length > 0 && (
                    <div className="flex justify-center">
                        <Button onClick={handleLoadMore} disabled={isLoadingMore || isLoading}>
                            {isLoadingMore ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                    {t("history.common.form.loading")}
                                </>
                            ) : (
                                t("history.common.form.loadMore")
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </ScrollArea>
    );
};

export default StarforcePage;
